import messages from '../../../locale/messages';

const validate = values => {

  const errors = {}
  
  if (!values.location) {
    errors.location = messages.required;
  } else if (values.location.trim() == "") {
    errors.location = 'Input is Blank';
  }

  if (!values.locationAddress) {
    errors.locationAddress = messages.required;
  }else if (values.locationAddress.trim() == "") {
    errors.locationAddress = 'Input is Blank';
  }

  return errors
}

export default validate
