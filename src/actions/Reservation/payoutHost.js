import {gql} from 'react-apollo';
// Toaster
import {toastr} from 'react-redux-toastr';

import {
  ADMIN_PAYOUT_HOST_START,
  ADMIN_PAYOUT_HOST_SUCCESS,
  ADMIN_PAYOUT_HOST_ERROR, 
} from '../../constants';

import {sendPaymentToHost} from '../../core/payment/payout/sendPaymentToHost';
// Helper
import { convert } from '../../helpers/currencyConvertion';
import formatAmountForCurrency from '../../helpers/formatAmountForCurrency';

// Stripe
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';

export function payoutHost( 
  reservationId, 
  destination, 
  payoutId, 
  amount, 
  currency, 
  paymentCurrency, 
  userId,
  paymentMethodId,
  hostEmail
) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: ADMIN_PAYOUT_HOST_START,
      payload:{
        loading: true,
        reservationId
      }
    });

    try {

      let rates = getState().currency.rates;
      let baseCurrency = getState().currency.base;
      let convertedAmount = amount;
      if (currency !== paymentCurrency) {
        convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);
      }
      
      if (paymentMethodId == 1 || paymentMethodId == 4) { // Pay Pal or Venmo
        // Use decimal places according to currency
        const payoutAmount = formatAmountForCurrency(convertedAmount, paymentCurrency);
        const { status } = await sendPaymentToHost(
          reservationId, 
          destination, 
          payoutId, 
          payoutAmount, 
          paymentCurrency,
          userId,
          paymentMethodId
        );

        if(status && (status === 'PENDING' || status === 'SUCCESS')) {
          dispatch({
            type: ADMIN_PAYOUT_HOST_SUCCESS,
            payload:{
              loading: false,
              completed: true
            }
          });
          toastr.success("Payment to Host", "Paypal payout initiated successfully! Please refresh the page to see any status update.");
        } else {
          toastr.error("Payment to Host", "Payment to Host failed, please check the log files");
          dispatch({
            type: ADMIN_PAYOUT_HOST_ERROR,
            payload: {
              loading: false
            }
          });
        }
      } else { // Stripe
        let cardDetails = {};
        let reservationDetails = {
          reservationId,
          amount: convertedAmount.toFixed(2),
          currency: paymentCurrency,
          hostEmail,
          payoutId,
          userId,
          destination,
          transfer_group: 'Payout to Host'
        };
        const { status, errorMessage } = await processStripePayment(
          'payout',
          cardDetails,
          reservationDetails
        );

        if (status && status === 200) {
          dispatch({
            type: ADMIN_PAYOUT_HOST_SUCCESS,
            payload: {
              loading: false,
              completed: true
            }
          });
          toastr.success("Payment to Host", "Payment transferred to host successfully!");
        } else {
          toastr.error("Payment to Host", errorMessage);
          dispatch({
            type: ADMIN_PAYOUT_HOST_ERROR,
            payload: {
              loading: false
            }
          });
        }
      }

    } catch (error) {
        dispatch({
          type: ADMIN_PAYOUT_HOST_ERROR,
          payload: {
            error,
            loading: false
          }
        });
      return false;
    }

    return true;
  };
}