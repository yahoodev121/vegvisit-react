import messages from '../../../locale/messages'

const validate = values => {

  const errors = {}

  if (!values.listId) {
    errors.listId = messages.required;
  } else if (isNaN(values.listId)) {
    errors.listId = 'Only numeric values are allowed';
  }

  if (!values.reviewContent) {
    errors.reviewContent = messages.required;
  }

  if (!values.rating) {
    errors.rating = messages.required;
  }

  return errors
}

export default validate;
