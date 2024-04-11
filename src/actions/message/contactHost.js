import { gql } from 'react-apollo';
import { toastr } from 'react-redux-toastr';

import {
  CONTACT_HOST_START,
  CONTACT_HOST_SUCCESS,
  CONTACT_HOST_ERROR,
} from '../../constants';

import { sendEmail } from '../../core/email/sendEmail';
import history from '../../core/history';
import log from '../../helpers/clientLog';
import isValidNumber from '../../helpers/isValidNumber';


export function contactHost(
  listId,
  host,
  content,
  startDate,
  endDate,
  personCapacity,
  hostEmail,
  firstName,
  listTitle,
  listTimeZone,
  total,
  currency,
  hostServiceFee
) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: CONTACT_HOST_START,
    });

    try {

      let account = getState().account.data;
      let guestEmail = account.email;

      let mutation = gql`
          mutation CreateThreadItems(
            $listId: Int!, 
            $host: String!,
            $content: String!,
            $type: String,
            $startDate: String,
            $endDate: String,
            $personCapacity: Int,
            $messageType: String,
          ){
              CreateThreadItems(
                listId: $listId,
                host: $host,
                content: $content,
                type: $type,
                startDate: $startDate,
                endDate: $endDate,
                personCapacity: $personCapacity,
                messageType: $messageType,
                
              ) {
                  id
                  threadId
                  sentBy
                  content
                  type
                  startDate
                  endDate
                  personCapacity
                  createdAt
              }
          }
      `;

      // Send Message
      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
          host,
          content,
          type: 'inquiry',
          startDate,
          endDate,
          personCapacity,
          messageType: 'inquiry'
        }
      });

      if (data && data.CreateThreadItems) {
        dispatch({
          type: CONTACT_HOST_SUCCESS,
        });
        toastr.success("Inquiry", "Your inquiry has been sent successfully");
        let emailContent = {
          receiverName: firstName,
          senderName: account.firstName,
          type: 'host',
          message: content,
          threadId: data.CreateThreadItems.threadId,
          checkIn: startDate,
          checkOut: endDate,
          personCapacity,
          listTitle, total, currency,
          listTimeZone,
          hostServiceFee
        };
        sendEmail(hostEmail, 'inquiry', emailContent);
        let guestEmailContent = {
          hostName: firstName,
          guestName: account.firstName,
          type: 'guest',
          message: content,
          threadId: data.CreateThreadItems.threadId,
          checkIn: startDate,
          checkOut: endDate,
          personCapacity,
          listId,
          listTitle,
          listTimeZone,
        };
        sendEmail(guestEmail, 'inquiryGuest', guestEmailContent);
        log.info(`actions.message.contactHost.contactHost: The contactHost action has been performed successfully with following data: ${JSON.stringify(emailContent)}`);
        if (isValidNumber(data.CreateThreadItems.threadId)) {
          history.push(`/message/${data.CreateThreadItems.threadId}/guest`);
        }
      } else {
        throw new Error('Creating ThreadItems failed in the contactHost action');
      }

    } catch (error) {
      log.error(`actions.message.contactHost.contactHost: The contactHost action failed. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      dispatch({
        type: CONTACT_HOST_ERROR,
        payload: {
          error
        }
      });
      toastr.error("Inquiry", "An error has occurred when trying to contact the host.");
      return false;
    }

    return true;
  };
}

/**
 * Standard flow booking request
 * @param {*} listId 
 * @param {*} host 
 * @param {*} content 
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} personCapacity 
 * @param {*} hostEmail 
 * @param {*} firstName 
 * @param {*} listTitle 
 * @param {*} listTimeZone 
 * @param {*} total 
 * @param {*} currency 
 * @param {*} formData 
 * @param {*} hostServiceFee 
 */
export function requestToBook(
  listId,
  host,
  content,
  startDate,
  endDate,
  personCapacity,
  hostEmail,
  firstName,
  listTitle,
  listTimeZone,
  total,
  currency,
  formData,
  hostServiceFee
) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: CONTACT_HOST_START,
    });

    try {

      let account = getState().account.data;
      let guestEmail = account.email;
      let cancellationPolicy = getState().book.data.listingData.cancellation.id;
      let preApprove = getState().book.bookDetails.preApprove;
      let bookingTypeData, reservationId;
      if (preApprove === true) {
        bookingTypeData = 'instant';
      } else {
        bookingTypeData = formData.bookingType;
      }

      let variables = Object.assign({}, formData, {
        bookingType: bookingTypeData,
        isPreApprove: preApprove,
        cancellationPolicy
      });
      
      const reservationMutation = gql`
      mutation createReservation(
        $listId: Int!, 
        $hostId: String!,
        $guestId: String!,
        $checkIn: String!,
        $checkOut: String!,
        $guests: Int!,
        $message: String,
        $basePrice: Float!,
        $cleaningPrice: Float,
        $currency: String!,
        $discount: Float,
        $discountType: String,
        $guestServiceFee: Float,
        $hostServiceFee: Float,
        $total: Float!,
        $bookingType: String,
        $paymentType: Int!,
        $cancellationPolicy: Int!,
        $specialPricing: String,
        $isSpecialPriceAssigned: Boolean,
        $isSpecialPriceAverage: Float,
        $dayDifference: Float,
        $isPreApprove:Boolean,
      ){
          createReservation(
            listId: $listId,
            hostId: $hostId,
            guestId: $guestId,
            checkIn: $checkIn,
            checkOut: $checkOut,
            guests: $guests,
            message: $message,
            basePrice: $basePrice,
            cleaningPrice: $cleaningPrice,
            currency: $currency,
            discount: $discount,
            discountType: $discountType,
            guestServiceFee: $guestServiceFee,
            hostServiceFee: $hostServiceFee,
            total: $total,
            bookingType: $bookingType,
            paymentType: $paymentType,
            cancellationPolicy: $cancellationPolicy,
            specialPricing: $specialPricing,
            isSpecialPriceAssigned: $isSpecialPriceAssigned,
            isSpecialPriceAverage: $isSpecialPriceAverage,
            dayDifference: $dayDifference,
            isPreApprove:$isPreApprove
          ) {
              id
              listId,
              hostId,
              guestId,
              checkIn,
              checkOut,
              guests,
              message,
              basePrice,
              cleaningPrice,
              currency,
              discount,
              discountType,
              guestServiceFee,
              hostServiceFee,
              total,
              confirmationCode,
              createdAt
              status
              paymentMethodId,
              cancellationPolicy,
              isSpecialPriceAverage,
              dayDifference
              isPreApprove                
          }
      }
    `;

      let parms = {
        listId,
        hostId: host,
        guestId: formData && formData.guestId,
        checkIn: startDate,
        checkOut: endDate,
        guests: personCapacity,
        message: content,
        basePrice: formData && formData.basePrice,
        cleaningPrice: formData && formData.cleaningPrice,
        currency: formData && formData.currency,
        discount: formData && formData.discount,
        discountType: formData && formData.discountType,
        guestServiceFee: formData && formData.guestServiceFee,
        hostServiceFee: formData && formData.hostServiceFee,
        total: formData && formData.total,
        bookingType: formData && formData.bookingType,
        paymentType: formData && formData.paymentType,
        cancellationPolicy: cancellationPolicy,
        specialPricing: JSON.stringify(formData && formData.bookingSpecialPricing),
        isSpecialPriceAssigned: formData && formData.isSpecialPriceAssigned,
        isSpecialPriceAverage: formData && formData.isSpecialPriceAverage,
        dayDifference: formData && formData.dayDifference,
        isPreApprove: preApprove
        
      };


      const reservationData = await client.mutate({
        mutation: reservationMutation,
        // variables: variables
        variables: parms
      });

      if (reservationData && reservationData.data && reservationData.data.createReservation) {
        reservationId = reservationData.data.createReservation.id;
      }

      let mutation = gql`
          mutation CreateThreadItems(
            $listId: Int!, 
            $host: String!,
            $content: String!,
            $type: String,
            $startDate: String,
            $endDate: String,
            $personCapacity: Int,
            $messageType: String,
            $reservationId: Int,
          ){
              CreateThreadItems(
                listId: $listId,
                host: $host,
                content: $content,
                type: $type,
                startDate: $startDate,
                endDate: $endDate,
                personCapacity: $personCapacity,
                messageType: $messageType,
                reservationId: $reservationId
              ) {
                  id
                  threadId
                  sentBy
                  content
                  type
                  startDate
                  endDate
                  personCapacity
                  createdAt
              }
          }
      `;

      // Send Message
      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
          host,
          content,
          type: 'inquiry',
          startDate,
          endDate,
          personCapacity,
          messageType: 'requestToBook',
          reservationId
        }
      });

      if (data && data.CreateThreadItems) {
        dispatch({
          type: CONTACT_HOST_SUCCESS,
        });

        let emailContent = {
          receiverName: firstName,
          senderName: account.firstName,
          type: 'host',
          message: content,
          threadId: data.CreateThreadItems.threadId,
          checkIn: startDate,
          checkOut: endDate,
          personCapacity,
          listTitle,
          listTimeZone,
          total,
          currency,
          hostServiceFee
        };
        sendEmail(hostEmail, 'requesttobook', emailContent);


        let guestEmailContent = {
          receiverName: firstName,
          senderName: account.firstName,
          type: 'guest',
          message: content,
          threadId: data.CreateThreadItems.threadId,
          checkIn: startDate,
          checkOut: endDate,
          personCapacity,
          listId,
          listTitle,
          listTimeZone,
          total,
          currency,
          hostServiceFee
        };
        sendEmail(guestEmail, 'bookingRequestGuest', guestEmailContent);
        log.info(`actions.message.contactHost.requestToBook: The requestToBook action has been performed successfully with following data: ${JSON.stringify(emailContent)}`);
        return {
          result: 'success',
          threadId: data.CreateThreadItems.threadId
        }
      } else {
        throw new Error('Creating ThreadItems failed in the requestToBook action');
      }

    } catch (error) {
      log.error(`actions.message.contactHost.requestToBook: The requestToBook action failed. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      dispatch({
        type: CONTACT_HOST_ERROR,
        payload: {
          error
        }
      });
      toastr.error("Request to book", "An error has occurred when trying to create a booking request.");
      return false;
    }
  };
}