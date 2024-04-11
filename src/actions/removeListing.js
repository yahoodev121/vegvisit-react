import { gql } from 'react-apollo';
import { toastr } from 'react-redux-toastr';
import {
  REMOVE_LISTING_START,
  REMOVE_LISTING_SUCCESS,
  REMOVE_LISTING_ERROR
} from '../constants';

import history from '../core/history';

const query = gql`
  query ManageListings{
    ManageListings {
        id
        title
        city
        updatedAt
        coverPhoto
        listType
        listPhotos{
            id
            name
        }
        settingsData {
            listsettings {
                id
                itemName
            }
        }
        listingSteps {
            id
            step1
            step2
            step3
        }
    }
  }
`;

const getUpcomingOrCancelledBookingQuery = gql`
query getUpcomingOrCancelledBookings ($listId: Int!){
  getUpcomingOrCancelledBookings(listId: $listId){
      count
    }
  }`;

export function removeListing(listId, userRole) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: REMOVE_LISTING_START,
    });

    try {


      let upcomingOrCancelledBookingCount;
      const bookedData = await client.query({
        query: getUpcomingOrCancelledBookingQuery,
        variables: {
          listId
        },
        fetchPolicy: 'network-only'
      });
      if (bookedData && bookedData.data && bookedData.data.getUpcomingOrCancelledBookings) {
        upcomingOrCancelledBookingCount = bookedData.data.getUpcomingOrCancelledBookings.count;
      }

      if (upcomingOrCancelledBookingCount > 0) {
        toastr.error('Error!', 'You cannot delete the listing as you have upcoming or cancelled bookings or enquiries for this listing. Please contact our support for further information or in order to proceed.');
        dispatch({
          type: REMOVE_LISTING_SUCCESS,
        });
      }
      else {
        const mutation = gql`
        mutation RemoveListing($listId:Int!) {
          RemoveListing (listId:$listId) {
            status
            id
            name
          }
        }
      `;
        // Send Request to get listing data
        const { data } = await client.mutate({
          mutation,
          variables: { listId },
          refetchQueries: [{ query }]
        });

        if (data && data.RemoveListing) {
          dispatch({
            type: REMOVE_LISTING_SUCCESS,
          });
          if (userRole != undefined && userRole === "admin") {
            history.push('/siteadmin/listings/');
          } else {
            history.push('/rooms');
          }

          if (data.RemoveListing.length > 0) {
            const removeFiles = await fetch('/removeMultiFiles', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                files: data.RemoveListing,
              }),
              credentials: 'include',
            });
          }
        } else {
          dispatch({
            type: REMOVE_LISTING_ERROR,
          });
        }
      }




    } catch (error) {
      dispatch({
        type: REMOVE_LISTING_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}
