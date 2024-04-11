import { gql } from 'react-apollo';
// Toaster
import { toastr } from 'react-redux-toastr';

import {
    MANANGE_LISTING_PUBLISH_STATUS_START,
    MANANGE_LISTING_PUBLISH_STATUS_SUCCESS,
    MANANGE_LISTING_PUBLISH_STATUS_ERROR,
} from '../../constants';

// To Refresh the Manage Listing Status
const ManageListingQuery = gql` 
    query ManageListings{
        ManageListings {
            id
            title
            city
            updatedAt
            coverPhoto
            isPublished
            isReady
            listingStatus
            listType
            listPhotos{
                id
                name
            }
            listCategories{
                id,
                listId
                category
                subCategory
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
  }`;

// To Refresh Listing Steps Query
const ListingStepsQuery = gql`
    query ($listId:String!) {
        showListingSteps (listId:$listId) {
            id
            listId
            step1
            step2
            step3
            listing {
                id
                isReady
                isPublished
                listingStatus
            }
        }
    }`;

const getUpcomingBookingQuery = gql`
query getUpcomingBookings ($listId: Int!){
    getUpcomingBookings(listId: $listId){
      count
    }
  }`;

export function ManagePublishStatus(listId, action) {

    return async (dispatch, getState, { client }) => {

        dispatch({
            type: MANANGE_LISTING_PUBLISH_STATUS_START,
            payload: {
                publishListLoading: true
              }
         });

        let mutation = gql`
            mutation ManagePublish($listId: Int!, $action: String!) {
                managePublish(listId: $listId, action: $action) {
                    status
                }
            }
        `;

        // Update List Status
        let WishListStatus = gql`
            mutation updateListStatus($listId:Int!, $action: String!) {
                 updateListStatus (listId:$listId, action: $action) {
                    status
                 }
             }
        `;

        let upcomingBookingCount;
        const bookedData = await client.query({
            query: getUpcomingBookingQuery,
            variables: {
                listId
            },
            fetchPolicy: 'network-only'
        });

        if (bookedData && bookedData.data && bookedData.data.getUpcomingBookings) {
            upcomingBookingCount = bookedData.data.getUpcomingBookings.count;
        }

        try {

            let type = 'Publish Listing';
            if (action === 'unPublish') {
                type = 'UnPublish Listing'
            }

            if (upcomingBookingCount > 0 && action === 'unPublish') {
                toastr.error('Unpublish Listing', 'You cannot unpublish as you have upcoming bookings or enquiries for this listing.');

                dispatch({
                    type: MANANGE_LISTING_PUBLISH_STATUS_ERROR,
                    payload: {
                        publishListLoading: false
                    }
                });
            } else {

                const { data } = await client.mutate({
                    mutation,
                    variables: {
                        listId,
                        action
                    },
                    refetchQueries: [
                        { query: ManageListingQuery },
                    ]
                });

                if (data.managePublish.status === '200') {

                    const { dataList } = await client.mutate({
                        mutation: WishListStatus,
                        variables: {
                            listId,
                            action
                        },
                    });

                    // Reload Existing Steps Page
                    const { data } = await client.query({
                        query: ListingStepsQuery,
                        variables: { listId },
                        fetchPolicy: 'network-only',
                    });
                    if(type == 'Publish Listing'){
                        toastr.success('Publish Listing',  "You're listing is now live on Vegvisits!");
                    }
                    else{
                        toastr.success('Unpublish Listing', "You're listing is no longer live. Publish your listing to start getting bookings.");
                    }


                    dispatch({
                        type: MANANGE_LISTING_PUBLISH_STATUS_SUCCESS,
                        payload: {
                            listingSteps: data.showListingSteps,
                            publishListLoading: false
                        }
                    });
                } else {

                    toastr.error(type, type + " has failed!");
                    dispatch({
                        type: MANANGE_LISTING_PUBLISH_STATUS_ERROR,
                        payload: {
                            status: data.managePublish.status,
                            publishListLoading: false
                        }
                    });
                }
            }
        } catch (error) {
            dispatch({
                type: MANANGE_LISTING_PUBLISH_STATUS_ERROR,
                payload: {
                    error,
                    publishListLoading: false
                }
            });
        }
    };
}
