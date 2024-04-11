import { gql } from 'react-apollo';
import { reset } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import history from '../../core/history';
import {
  ADD_PAYOUT_START,
  ADD_PAYOUT_SUCCESS,
  ADD_PAYOUT_ERROR,
} from '../../constants';

import getPayoutsQuery from './getPayouts.graphql';

// Stripe
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import { useStripeExpress } from '../../config';
import { createStripeAuthUrl } from '../../core/payment/stripe/helpers/createStripeAuthUrl';

export function addPayout(
  methodId,
  payEmail,
  address1,
  address2,
  city,
  state,
  country,
  zipcode,
  currency,
  firstname,
  lastname,
  accountNumber,
  routingNumber,
  ssn4Digits,
  day,
  month,
  year) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: ADD_PAYOUT_START,
      payload: {
        payoutLoading: true
      }
    });

    try {

      let mutation = gql`
          mutation addPayout(
            $methodId: Int!, 
            $payEmail: String!,
            $address1: String,
            $address2: String,
            $city: String,
            $state: String,
            $country: String!,
            $zipcode: String,
            $currency: String!,
            $last4Digits: Int
          ){
              addPayout(
                methodId: $methodId,
                payEmail: $payEmail,
                address1: $address1,
                address2: $address2,
                city: $city,
                state: $state,
                country: $country,
                zipcode: $zipcode,
                currency: $currency,
                last4Digits: $last4Digits
              ) {
                  id
                  methodId
                  userId
                  payEmail
                  last4Digits
                  address1
                  address2
                  city
                  state
                  country
                  zipcode
                  currency
                  createdAt
                  status
              }
          }
      `;

      if (methodId == 1 || methodId == 4) { // PayPal or Venmo
        const { data } = await client.mutate({
          mutation,
          variables: {
            methodId,
            payEmail,
            address1,
            address2,
            city,
            state,
            country,
            zipcode,
            currency
          },
          refetchQueries: [{ query: getPayoutsQuery }]
        });

        if (data && data.addPayout) {
          dispatch({
            type: ADD_PAYOUT_SUCCESS,
            payload: {
              status: data.addPayout.status,
              payoutLoading: false
            }
          });
          dispatch(reset('PayoutForm'));
          history.push('/user/payout');
        }
      } else if (methodId == 2) { // Stripe
        let responseStatus;
        let last4Digits = accountNumber ? accountNumber.slice(-4) : null;
        if (!useStripeExpress) {
          let DOBday = day ? parseInt(day) : null;
          let DOBMonth = month >= 0 ? parseInt(month) + 1 : null;
          let DOBYear = year ? parseInt(year) : null;
          let userDetails = {
            payEmail,
            day: DOBday,
            month: DOBMonth,
            year: DOBYear
          };

          let bankDetails = {
            firstname,
            lastname,
            routingNumber,
            accountNumber,
            ssn4Digits,
            city,
            address1,
            zipcode,
            state,
            country,
            currency
          };

          const { status, errorMessage, accountId } = await processStripePayment(
            'addPayout',
            userDetails,
            bankDetails
          );
          responseStatus = status;
        }

        if (useStripeExpress || (responseStatus === 200 && accountId)) {
          const { data } = await client.mutate({
            mutation,
            variables: {
              methodId,
              payEmail: useStripeExpress ? payEmail : accountId,
              address1,
              address2,
              city,
              state,
              country,
              zipcode,
              currency,
              last4Digits: useStripeExpress ? null : last4Digits
            },
            refetchQueries: [{ query: getPayoutsQuery }]
          });
          if (data && data.addPayout) {
            dispatch({
              type: ADD_PAYOUT_SUCCESS,
              payload: {
                status: data.addPayout.status,
                payoutLoading: false
              }
            });
            if (useStripeExpress) {
              const stripeMonth = (typeof month === 'number' && !Number.isNaN(month)) ? month + 1 : null;
              const url = createStripeAuthUrl({firstName: firstname, lastName: lastname, payEmail, country, birthdayDay: day, birthdayMonth: stripeMonth, birthdayYear: year});
              window.location = url;
            } else {
              dispatch(reset('PayoutForm'));
              history.push('/user/payout');
            }
          }
        } else {
          toastr.error('Failed!', errorMessage);
          dispatch({
            type: ADD_PAYOUT_ERROR,
            payload: {
              errorMessage,
              payoutLoading: false
            }
          });
        }
      }
    } catch (error) {
      dispatch({
        type: ADD_PAYOUT_ERROR,
        payload: {
          error,
          payoutLoading: false
        }
      });
      return false;
    }

    return true;
  };
}


