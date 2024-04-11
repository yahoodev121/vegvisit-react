
const validate = values => {

  const errors = {}

  if (!values.title) {
    errors.title = messages.required;
  }

  if (!values.description) {
    errors.description = messages.required;
  }

  if (!values.buttonLabel) {
    errors.buttonLabel = messages.required;
  }

  return errors
}

export default validate
