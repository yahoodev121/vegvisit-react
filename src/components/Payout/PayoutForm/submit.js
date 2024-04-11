// Redux Form
// import { reset } from 'redux-form';

import { addPayout } from '../../../actions/Payout/addPayoutAction';

import { useStripeExpress } from '../../../config';

async function submit(values, dispatch) {
  const paymentType = values.methodId;
  // PayPal, and Stripe before stripe_user_id is received by Stripe Express Connect and updated
  // const payEmail = paymentType === 1 ? values.payEmail : values.email;
  let payEmail;
  if (paymentType === 1) {
    payEmail = values.payEmail;
  } else if (paymentType === 2) {
    payEmail = values.email;
  } else if (paymentType === 4) {
    payEmail = values.payPhone;
  }
  // Stripe Express prefilled values
  let firstname;
  let lastname;
  if (paymentType === 2) {
    if (useStripeExpress) { // user user account values
      firstname = values.firstName;
      lastname = values.lastName;
    } else { // use values defined in Stripe form
      firstname = values.firstname;
      lastname = values.lastname;
    }
  } else {
    firstname = null;
    lastname = null;
  }
  const accountNumber = (paymentType === 2 && !useStripeExpress) ? values.accountNumber : null;
  const routingNumber = (paymentType === 2 && !useStripeExpress) ? values.routingNumber : null;
  const ssn4Digits = (paymentType === 2 && !useStripeExpress) ? values.ssn4Digits : null;

  dispatch(addPayout(
    values.methodId,
    payEmail,
    values.address1,
    values.address2,
    values.city,
    values.state,
    values.country,
    values.zipcode,
    values.currency,
    firstname,
    lastname,
    accountNumber,
    routingNumber,
    ssn4Digits,
    values.day,
    values.month,
    values.year,
    ),
  );
  // dispatch(reset('PayoutForm'));
}

export default submit;
