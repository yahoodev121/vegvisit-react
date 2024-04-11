import { gql } from 'react-apollo';
import {
  SEND_MESSAGE_START,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
} from '../../constants';
import { updateReservation } from '../Reservation/updateReservation';
import { sendEmail } from '../../core/email/sendEmail';
import log from '../../helpers/clientLog';

const ThreadItemsQuery = gql`
query getThread($threadType: String, $threadId: Int){
  getThread(threadType: $threadType, threadId: $threadId) {
    id
    listId
    guest
    host
    listData {
      title
      city
      state
      country
      timeZone
      listingData {
        basePrice
        cleaningPrice
        currency
        monthlyDiscount
        weeklyDiscount
      }
    }
    threadItemForType {
      id
      threadId
      reservationId
      content
      sentBy
      type
      startDate
      endDate
      personCapacity
      createdAt
      cancelData {
        id
        reservationId
        cancellationPolicy
        guestServiceFee
        hostServiceFee
        refundToGuest
        payoutToHost
        total 
        currency
      }
      reservation {
        id
        listId
        hostId
        guestId
        checkIn
        checkOut
        basePrice
        cleaningPrice
        total
        currency
        guests
        confirmationCode
        guestServiceFee
        discount
        discountType
        createdAt
        updatedAt
        hostServiceFee
        bookingSpecialPricing {
          id
          reservationId
          blockedDates
          isSpecialPrice
        }
      }
    }
    threadItems {
      id
      threadId
      reservationId
      content
      sentBy
      type
      startDate
      endDate
      createdAt
      messageType
    }
    threadItemsCount
    guestProfile {
      profileId
      displayName
      firstName
      location
      reviewsCount
      userVerification {
        id
        isEmailConfirmed
        isFacebookConnected
        isGoogleConnected
        isIdVerification
      }
    }
    guestUserData {
      email
      userBanStatus
    }
    hostProfile {
      profileId
      displayName
      firstName
      picture
      location
      reviewsCount
      userVerification {
        id
        isEmailConfirmed
        isFacebookConnected
        isGoogleConnected
        isIdVerification
      }
    }
    hostUserData {
      email
    }
    status
  }
}
`;
export function sendMessageAction(
  threadId,
  threadType,
  content,
  type,
  startDate,
  endDate,
  personCapacity,
  reservationId,
  receiverName,
  senderName,
  receiverType,
  receiverEmail,
  checkIn,
  hostLocation,
  hostProfilePic,
  hostJoinedDate,
  messageType,
  title,
  checkOut,
  city,
  state,
  country,
  timeZone,
  email,
  currency,
  total
) {
  return async (dispatch, getState, { client }) => {
    log.debug(`actions.message.sendMessageAction.sendMessageAction: Starting send message action for thread ${threadId} and type ${type}`);  
    dispatch({
      type: SEND_MESSAGE_START,
    });

    try {

      let accountEmail = getState().account.data.email;

      let mutation = gql`
          mutation sendMessage(
          $threadId: Int!, 
          $content: String, 
          $type: String,
          $startDate: String,
          $endDate: String,
          $personCapacity: Int,
          $reservationId: Int
          $messageType: String
          ) {
            sendMessage(
            threadId: $threadId, 
            content: $content, 
            type: $type,
            startDate: $startDate,
            endDate: $endDate,
            personCapacity: $personCapacity,
            reservationId: $reservationId,
            messageType: $messageType
            ){
              id
              sentBy
              content
              type
              reservationId
              startDate
              endDate
              personCapacity
              createdAt
              status
            }
          }
      `;
      const variables = {
        threadId,
        content: content ? content : '',
        type,
        startDate,
        endDate,
        personCapacity,
        reservationId,
        messageType
      };
      log.debug(`actions.message.sendMessageAction.sendMessageAction: Sending message with following data: ${JSON.stringify(variables)}`);  
      // Send Message
      const { data } = await client.mutate({
        mutation,
        variables,
        refetchQueries: [
          {
            query: ThreadItemsQuery,
            variables: {
              threadId,
              threadType
            },
          }
        ]
      });
      log.debug(`actions.message.sendMessageAction.sendMessageAction: Send message result was: ${JSON.stringify(data)}`);  
      if (data && data.sendMessage && (data.sendMessage.status != 'userbanned' || data.sendMessage.status == null)) {
        if (reservationId != null && reservationId != undefined) {
          log.debug(`actions.message.sendMessageAction.sendMessageAction: Updating reservation now for reservation ${reservationId}`);
          dispatch(updateReservation(reservationId, type, threadType, threadId, total));
        } else {
          log.debug(`actions.message.sendMessageAction.sendMessageAction: Reservation id is ${reservationId}, therefore not updating reservation.`);
        }

        log.debug(`actions.message.sendMessageAction.sendMessageAction: Sent message successfully. Will now send emails.`);
        dispatch({
          type: SEND_MESSAGE_SUCCESS,
        });
        if (type === 'preApproved' && messageType === 'inquiry') {
          let emailContent = {
            hostName: senderName,
            guestName: receiverName,
            listTitle: title,
            checkIn,
            checkOut,
            listCity: city,
            threadId,
            listTimeZone: timeZone
          };
          sendEmail(receiverEmail, 'bookingPreApprovalInquiry', emailContent);
        }

        if (type === 'preApproved' && messageType === 'requestToBook') {
          let emailContent = {
            hostName: senderName,
            guestName: receiverName,
            listTitle: title,
            checkIn,
            checkOut,
            listCity: city,
            threadId,
            listTimeZone: timeZone
          };
          sendEmail(receiverEmail, 'bookingPreApproval', emailContent);

        }
        if (type === 'message') {
          let emailContent = {
            receiverName,
            senderName,
            receiverType,
            type: receiverType,
            message: content ? content : '',
            threadId
          };
          sendEmail(receiverEmail, 'message', emailContent);
        }

        if (type === 'declined') {
          let emailContent = {
            hostName: senderName,
            guestName: receiverName,
            checkIn,
            checkOut,
            listTitle: title,
            listCity: city,
            listState: state,
            listCountry: country,
            listTimeZone: timeZone,
            confirmationCode: '',
            hostLocation,
            hostProfilePic,
            hostJoinedDate
          };
          sendEmail(receiverEmail, 'bookingDeclinedToGuest', emailContent);
        }

        log.debug(`actions.message.sendMessageAction.sendMessageAction: Sending emails done.`);  

      } else {
        throw Error(`Sending message did not return expected result: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      log.error(`actions.message.sendMessageAction.sendMessageAction: Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      dispatch({
        type: SEND_MESSAGE_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
