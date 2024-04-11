import messages from '../../locale/messages';

const validate = values => {
  const errors = {}

  if (!values.roomType) {
    errors.roomType = messages.required;
  }

  if (values.summary) {
    let cleanText = values.summary.replace(/<\/?[^>]+(>|$)/g, "");
    if (cleanText.length < 100) {
      errors.summary = 'Must have at least 100 characters';
    }
  }

  return errors
}

export default validate
