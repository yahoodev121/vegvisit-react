import { gql } from 'react-apollo';

import history from '../../core/history';
import {
  BOOKING_PROCESS_START,
  BOOKING_PROCESS_SUCCESS,
  BOOKING_PROCESS_ERROR,
} from '../../constants';

export function bookingProcess(listId, guests, startDate, endDate, preApprove, hostDetails, total, currency, messageType, reservationId) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: BOOKING_PROCESS_START,
      payload: {
        bookingLoading: true
      }
    });

    try {

      let query = gql`
          query UserListing($listId:String!) {
            UserListing (listId:$listId) {
              id
              userId
              title
              coverPhoto
              country
              city
              state
              timeZone
              personCapacity
              bookingType
              listPhotos{
                id
                name
              }
              user {
                email
                profile{
                  profileId
                  displayName
                  firstName
                  picture
                }
              }
              settingsData {
                id
                settingsId
                listsettings {
                  id
                  itemName
                  settingsType {
                    typeName
                  }
                }
              }
              houseRules {
                houseRulesId
                listsettings{
                  itemName
                  isEnable
                  settingsType {
                    typeName
                  }
                }
              }
              listingData {
                checkInStart,
                checkInEnd,
                basePrice,
                securityDeposit,
                cleaningPrice,
                currency,
                weeklyDiscount,
                monthlyDiscount,
                cancellation {
                  id
                  policyName
                }
              }
              listBlockedPrice {
                id
                listId
                isSpecialPrice
                blockedDates
              }
            }
        }
      `;

      let reservationQuery = gql`
      query getReservation($reservationId:Int!) {
        getReservation (reservationId:$reservationId) {
          id
          guestId
          hostId
          listId
          total
          guestServiceFee
          listData {
            id
            title
          }
        }
      }`;

      const { data } = await client.query({
        query,
        variables: {
          listId
        },
      });

      if (data && data.UserListing) {

        if (reservationId) {
          let reservationData = await client.query({
            query: reservationQuery,
            variables: {
              reservationId
            },
            fetchPolicy: 'network-only',
          });

          dispatch({
            type: BOOKING_PROCESS_SUCCESS,
            payload: {
              data: data.UserListing,
              bookDetails: {
                guests,
                startDate,
                endDate,
                preApprove,
                messageType
              },
              reservationDetails: reservationData.data.getReservation,
              bookingLoading: false
            }
          });

          history.push('/book/' + listId);
        } else {

          dispatch({
            type: BOOKING_PROCESS_SUCCESS,
            payload: {
              data: data.UserListing,
              bookDetails: {
                guests,
                startDate,
                endDate,
                preApprove,
                messageType
              },
              bookingLoading: false
            }
          });

        }

        history.push('/book/' + listId);
      }

    } catch (error) {
      dispatch({
        type: BOOKING_PROCESS_ERROR,
        payload: {
          error,
          bookingLoading: false
        }
      });
      return false;
    }

    return true;
  };
}

