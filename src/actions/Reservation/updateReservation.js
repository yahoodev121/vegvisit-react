import { gql } from 'react-apollo';

import {
  UPDATE_RESERVATION_STATE_START,
  UPDATE_RESERVATION_STATE_SUCCESS,
  UPDATE_RESERVATION_STATE_ERROR
} from '../../constants';
import log from '../../helpers/clientLog';

const getAllReservationQuery = gql`
  query getAllReservation ($userType: String){
    getAllReservation(userType: $userType){
      reservationData {
        id
        reservationState
      }
    }
  }
`;

export function updateReservation(reservationId, actionType, userType, threadId, total) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: UPDATE_RESERVATION_STATE_START,
    });

    try {

      let mutation = gql`
          mutation updateReservation(
            $reservationId: Int!, 
            $actionType: String!,
            $threadId: Int,
            $total: Int
          ){
              updateReservation(
                reservationId: $reservationId,
                actionType: $actionType,
                threadId: $threadId,
                total: $total
              ) {
                  status
              }
          }
      `;

      const { data } = await client.mutate({
        mutation,
        variables: {
          reservationId,
          actionType,
          threadId,
          total
        },
        refetchQueries: [
          {
            query: getAllReservationQuery,
            variables: {
              userType
            },
          }
        ]
      });
      log.debug(`actions.Reservation.updateReservation.updateReservation: Updated reservation ${reservationId} with result: ${JSON.stringify(data)}`);  

      if (data.updateReservation.status === '200') {
        let reservationQuery = gql`
          query getReservationData ($reservationId: Int!){
            getItinerary(reservationId: $reservationId){
              id
              confirmationCode
              checkIn
              checkOut
              listData {
                id
                title
                city
                timeZone
                listingData{
                  checkInStart
                  checkInEnd
                }
              }
              hostData {
                firstName
                location
                picture
                userData {
                  email
                }
              }
              guestData {
                firstName
                userData {
                  email
                }
              }
              messageData {
                id
              }
              reservationState
            }
          }
        `;
        const reservation = await client.query({
          query: reservationQuery,
          variables: {
            reservationId,
          },
          fetchPolicy: 'network-only'
        });
        let content;

        if (reservation.data.getItinerary) {
          let reservationState = reservation.data.getItinerary.reservationState;
          let confirmationCode = reservation.data.getItinerary.confirmationCode;
          let checkIn = reservation.data.getItinerary.checkIn;
          let checkOut = reservation.data.getItinerary.checkOut;
          let hostName = reservation.data.getItinerary.hostData.firstName;
          let hostEmail = reservation.data.getItinerary.hostData.userData.email;
          let guestName = reservation.data.getItinerary.guestData.firstName;
          let guestEmail = reservation.data.getItinerary.guestData.userData.email;
          let listTitle = reservation.data.getItinerary.listData.title;
          let listCity = reservation.data.getItinerary.listData.city;
          let listTimeZone = reservation.data.getItinerary.listData.timeZone;
          let threadId = reservation.data.getItinerary.messageData.id;
          let hostLocation = reservation.data.getItinerary.hostData.location;
          let hostProfilePic = reservation.data.getItinerary.hostData.picture;

          let allowedCheckInTime = reservation.data.getItinerary.listData.listingData.checkInStart;
          let allowedCheckOutTime = reservation.data.getItinerary.listData.listingData.checkInEnd;


          let hostJoinedDate = reservation.data.getItinerary.hostData.createdAt;

          let hostContactNumber = reservation.data.getItinerary.hostData.phoneNumber;

          if (reservationState === 'approved') {
            content = {
              hostName,
              guestName,
              listTitle,
              listCity,
              listTimeZone,
              threadId,
              hostLocation,
              hostProfilePic,
              checkIn,
              checkOut,
              hostJoinedDate,
              hostContactNumber,
              hostEmail,
              allowedCheckInTime,
              allowedCheckOutTime
            };

            // await sendEmail(guestEmail, 'bookingConfirmedToGuest', content);
          }
          if (reservationState === 'declined') {
            content = {
              hostName,
              guestName,
              confirmationCode,
              hostLocation,
              hostProfilePic,
              checkIn,
              checkOut,
              listTimeZone,
              hostJoinedDate
            };
            // await sendEmail(guestEmail, 'bookingDeclinedToGuest', content);
          }

        }

        dispatch({
          type: UPDATE_RESERVATION_STATE_SUCCESS,
        });
      }

    } catch (error) {
      log.error(`actions.Reservation.updateReservation.updateReservation: Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      dispatch({
        type: UPDATE_RESERVATION_STATE_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}