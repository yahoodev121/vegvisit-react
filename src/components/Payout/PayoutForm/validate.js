import messages from '../../../locale/messages';
import { useStripeExpress, stripeExpressCountries } from '../../../config';

const validate = (values) => {
  const offerStripe = stripeExpressCountries && stripeExpressCountries.length > 0 && stripeExpressCountries.indexOf(values.country) !== -1;

  const errors = {};

  if (!values.country || typeof values.country !== 'string') {
    errors.country = messages.required;
  }

  if (values.paymentType == 2 && !offerStripe) {
    errors.country = messages.payoutValidationWrongStripeCountry;
  }

  /* if (!values.city) {
    errors.city = messages.required;
  }

  if (!values.state) {
    errors.state = messages.required;
  }

  if (!values.zipcode) {
    errors.zipcode = messages.required;
  } */

  if (!values.payEmail) {
    errors.payEmail = messages.required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.payEmail)) {
    errors.payEmail = messages.payoutError5;
  }

  if (values.payEmail !== values.payEmail2) {
    errors.payEmail2 = messages.payoutErrorNotMatchingEmail;
  }

  let phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!values.payPhone) {
    errors.payPhone = messages.required;
  } else if (!phoneRegex.test(values.payPhone)) {
    errors.payPhone = messages.payoutErrorNotValidUSPhoneNumber;
  } else {
    values.payPhone = values.payPhone.replace(phoneRegex, '$1-$2-$3');
  }

  if (phoneRegex.test(values.payPhone2)) {
    values.payPhone2 = values.payPhone2.replace(phoneRegex, '$1-$2-$3');
  }
  if (values.payPhone !== values.payPhone2) {
    errors.payPhone2 = messages.payoutErrorNotMatchingPhoneNumber;
  }

  if (!values.currency) {
    errors.currency = messages.required;
  }

  return errors;
};

export default validate;
