import messages from '../../locale/messages';

const validate = values => {

  const errors = {}

  if (!values.message) {
    errors.message = messages.required;
  }

  return errors;
}

export default validate;