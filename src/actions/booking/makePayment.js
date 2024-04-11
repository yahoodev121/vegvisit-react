import { gql } from 'react-apollo';
import {
  BOOKING_PAYMENT_START,
  BOOKING_PAYMENT_SUCCESS,
  BOOKING_PAYMENT_ERROR,
} from '../../constants';

// Helper
import { convert } from '../../helpers/currencyConvertion';
import log from '../../helpers/clientLog';

// Stripe
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';

// PayPal
import { paypalCaptureOrder } from '../../core/payment/paypalCaptureOrder';

import { toastr } from 'react-redux-toastr';
import history from '../../core/history';

export function makePayment(
  listId,
  title,
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
  bookingType,
  paymentCurrency,
  paymentType,
  // name,
  // cardNumber,
  // cvv,
  // expiryDate,
  // expiryYear,
  guestEmail,
  specialPricing,
  isSpecialPriceAssigned,
  isSpecialPriceAverage,
  dayDifference,
  paymentMethodId,
  orderID,
  paymentAmount
) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: BOOKING_PAYMENT_START,
      payload: {
        paymentLoading: true
      }
    });

    try {

      const mutation = gql`
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

      let preApprove = getState().book.bookDetails.preApprove;
      let bookingTypeData;
      if (preApprove === true) {
        bookingTypeData = 'instant';
      } else {
        bookingTypeData = bookingType;
      }

      let cancellationPolicy = getState().book.data.listingData.cancellation.id;
      let reservationDetails = getState().book.reservationDetails;

      if (reservationDetails) {
        let reservationId = reservationDetails.id;
        let amount = reservationDetails.total + reservationDetails.guestServiceFee;
        let rates = getState().currency.rates;
        let currentCurrency = (getState().currency.to) ? getState().currency.to : getState().currency.base;
        let baseCurrency = getState().currency.base;
        let convertedAmount = 0;


        let overAllAmount = amount && amount.toString().split(".");
        let isAmount = 0;
        if (overAllAmount && overAllAmount[1] == "00") {
          isAmount = overAllAmount && overAllAmount[0];
          // isAmount = Math.round(amount);
        } else {
          isAmount = amount;
        }

        if (paymentType == 1) {
          paypalPayment(paymentCurrency, paymentAmount, reservationId, dispatch, orderID);
        } else {
          convertedAmount = convert(baseCurrency, rates, amount, currency, currentCurrency);
          let cardDetails = {};
          let reservationDetails = {
            reservationId,
            listId,
            hostId,
            guestId,
            guestEmail,
            title,
            amount: convertedAmount.toFixed(2),
            currency: currentCurrency,
            bookingTypeData: bookingTypeData,
            paymentType: paymentType
          };

          const { status, errorMessage } = await processStripePayment(
            'reservation',
            cardDetails,
            reservationDetails,
            paymentMethodId,
          );

          if (status === 200) {
            dispatch({
              type: BOOKING_PAYMENT_SUCCESS,
              payload: { paymentLoading: true }
            });

          } else {
            errorMessage ? toastr.error('Failed!', errorMessage) : '';
            dispatch({
              type: BOOKING_PAYMENT_ERROR,
              payload: { paymentLoading: false }
            });
          }
        }
      } else {

        const { data } = await client.mutate({
          mutation,
          variables: {
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
            bookingType: bookingTypeData,
            paymentType,
            cancellationPolicy,
            specialPricing,
            isSpecialPriceAssigned,
            isSpecialPriceAverage,
            dayDifference,
            isPreApprove: preApprove
          }
        })

        if (data && data.createReservation) {
          let reservationId = data.createReservation.id;
          let amount = total + guestServiceFee;
          let rates = getState().currency.rates;
          let currentCurrency = (getState().currency.to) ? getState().currency.to : getState().currency.base;
          let baseCurrency = getState().currency.base;
          let convertedAmount = 0;
          
          let overAllAmount = amount && amount.toString().split(".");
          let isAmount = 0;
          if (overAllAmount && overAllAmount[1] == "00") {
            isAmount = overAllAmount && overAllAmount[0];
            // isAmount = Math.round(amount);
          } else {
            isAmount = amount;
          }

          if (paymentType == 1) {
            paypalPayment(paymentCurrency, paymentAmount, reservationId, dispatch, orderID);
          } else {
            convertedAmount = convert(baseCurrency, rates, amount, currency, currentCurrency);
            let cardDetails = {
              // name,
              // number: cardNumber,
              // exp_month: expiryDate,
              // exp_year: expiryYear,
              // cvc: cvv
            };
            let reservationDetails = {
              reservationId,
              listId,
              hostId,
              guestId,
              guestEmail,
              title,
              amount: convertedAmount.toFixed(2),
              currency: currentCurrency,
              bookingTypeData: bookingTypeData,
              paymentType: paymentType
            };
            const { status, errorMessage } = await processStripePayment(
              'reservation',
              cardDetails,
              reservationDetails,
              paymentMethodId
            );

            if (status === 200) {
              dispatch({
                type: BOOKING_PAYMENT_SUCCESS,
                payload: { paymentLoading: true }
              });

            } else {
              errorMessage ? toastr.error('Failed!', errorMessage) : '';
              dispatch({
                type: BOOKING_PAYMENT_ERROR,
                payload: { paymentLoading: false }
              });
            }
          }
        }
      }
    } catch (error) {
      // console.error('Make payment error: ' + error.message, error);
      toastr.error('Failed!', 'The payment could not be performed successfully');
      log.error(`actions.booking.makePayment.makePayment: The payment could not be performed successfully. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      dispatch({
        type: BOOKING_PAYMENT_ERROR,
        payload: {
          error,
          paymentLoading: false
        }
      });
      return false;
    }

    return true;
  };

  async function paypalPayment(paymentCurrency, paymentAmount, reservationId, dispatch, orderID) {
    const { status, redirect } = await paypalCaptureOrder(reservationId, paymentAmount, paymentCurrency, orderID);
    if (status === 'Success') {
      log.info(`actions.booking.makePayment.makePayment.paypalPayment: The payment was performed successfully for reservationId ${reservationId} and orderID ${orderID}.`);
      dispatch({
        type: BOOKING_PAYMENT_SUCCESS,
        payload: { paymentLoading: false }
      });
      if (redirect) {
        history.go(-1);
        setTimeout(() => {
          window.location.replace(redirect);
        }, 100);
      }
    }
    else {
      log.error(`actions.booking.makePayment.makePayment.paypalPayment: The payment could not be performed successfully, paypalCaptureOrder failed.`);
      toastr.error('Failed!', 'The payment could not be performed successfully');
      dispatch({
        type: BOOKING_PAYMENT_ERROR,
        payload: { paymentLoading: false }
      });
    }
  }
}

