import {gql} from 'react-apollo';
// Toaster
import {toastr} from 'react-redux-toastr';

import {
  ADMIN_REFUND_GUEST_START,
  ADMIN_REFUND_GUEST_SUCCESS,
  ADMIN_REFUND_GUEST_ERROR, 
} from '../../constants';

import {refundToGuest} from '../../core/payment/refund/refundToGuest';

// Helper
import { convert } from '../../helpers/currencyConvertion';
import formatAmountForCurrency from '../../helpers/formatAmountForCurrency';

// Stripe
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import log from '../../helpers/clientLog';

export function refundGuest(
    reservationId, 
    receiverEmail, 
    receiverId, 
    payerEmail, 
    payerId, 
    amount, 
    currency, 
    paymentCurrency, 
    paymentMethodId, 
    transactionId
  ) 
{

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: ADMIN_REFUND_GUEST_START,
      payload:{
        refundLoading: true,
        reservationId
      }
    });

    try {

      let rates = getState().currency.rates;
      let baseCurrency = getState().currency.base;
      let convertedAmount = 0;
      let currentCurrency = (getState().currency.to) ? getState().currency.to : getState().currency.base;
      if (paymentMethodId == 1) {
        // PayPal
        let convertedAmount = amount;
        if (currency !== paymentCurrency) {
          convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);
        }
        
        // Use decimal places according to currency
        const refundAmount = formatAmountForCurrency(convertedAmount, paymentCurrency);
        const { status } = await refundToGuest(
          reservationId, receiverEmail, receiverId, payerEmail, payerId, refundAmount, paymentCurrency, paymentMethodId, transactionId
        );

        if(status && (status === 'COMPLETED' || status === 'PENDING')) {
          dispatch({
            type: ADMIN_REFUND_GUEST_SUCCESS,
            payload:{
              refundLoading: false,
              completed: true
            }
          });
          if (status === 'COMPLETED') {
            toastr.success("Refund to Guest", "PayPal refund performed successfully");
            log.debug(`actions.Reservation.refundGuest.refundGuest: Paypal refund performed successfully for reservation ${reservationId} to receiver ${receiverId}: ${receiverEmail} with status ${status}`);  
          } else {
            toastr.warning("Refund to Guest", "PayPal refund is pending, please check the account for further information and the final result");
            log.warn(`actions.Reservation.refundGuest.refundGuest: Paypal refund is pending for reservation ${reservationId} to receiver ${receiverId}: ${receiverEmail} with status ${status}`);  
          }
        } else {
          toastr.error("Refund to Guest", "PayPal refund to guest failed");
          dispatch({
            type: ADMIN_REFUND_GUEST_ERROR,
            payload: {
              refundLoading: false
            }
          });
          log.error(`actions.Reservation.refundGuest.refundGuest: PayPal refund failed for reservation ${reservationId} to receiver ${receiverId}: ${receiverEmail} with status ${status}`);
        }
      }
    } catch (error) {
        dispatch({
          type: ADMIN_REFUND_GUEST_ERROR,
          payload: {
            error,
            refundLoading: false
          }
        });
      return false;
    }

    return true;
  };
}