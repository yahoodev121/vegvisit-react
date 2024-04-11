import messages from '../../../locale/messages';

const validate = values => {

  const errors = {}

  if (!values.content) {
    errors.content = messages.required;
  }

  if (!values.metaTitle) {
    errors.metaTitle = messages.required;
  }

  if (!values.metaDescription) {
    errors.metaDescription = messages.required;
  }

  return errors
}

export default validate
