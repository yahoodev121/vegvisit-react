import messages from '../../../../locale/messages'
const validate = values => {

  const errors = {};

  if ((values.paymentMethodId == 1 || values.paymentMethodId == 4) && !values.paymentCurrency) {
    errors.paymentCurrency = messages.required;
  }

  return errors;
}

export default validate;
