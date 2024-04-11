import messages from './messages';

const validate = values => {

  const errors = {}

  if (!values.title) {
    errors.title = messages.required;
  }

  if (!values.content) {
    errors.content = messages.required;
  }

  return errors
}

export default validate;
