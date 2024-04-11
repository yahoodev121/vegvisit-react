import messages from '../../../locale/messages'

const validate = values => {

  const errors = {}

  if ((typeof values.guestValue == "number" && values.guestValue.toString().trim() === '') || (typeof values.guestValue == "string" && values.guestValue.trim() === '') || values.guestValue == null) {
    errors.guestValue = messages.required;
  }

  if ((typeof values.hostValue == "number" && values.hostValue.toString().trim() === '') || (typeof values.hostValue == "string" && values.hostValue.trim() === '') || values.hostValue == null) {
    errors.hostValue = messages.required;
  } 

  if (values.guestType === 'fixed' || values.hostType === 'fixed') {
    if(!values.currency) {
    	errors.currency = messages.required;
    }
  }
 
  if(isNaN(values.guestValue)){
    errors.guestValue = 'Only numeric values are allowed';
  } 

  if(isNaN(values.hostValue)){
    errors.hostValue = 'Only numeric values are allowed';
  } 

  if (values.guestType === 'percentage') {
    if(values.guestValue && (parseInt(values.guestValue, 10) < 0 || parseInt(values.guestValue, 10) > 99)) {
      errors.guestValue = 'Choose percentage value between 1 to 99';
    }
  }

  if (values.hostType === 'percentage') {
    if(values.hostValue && (parseInt(values.hostValue, 10) < 0 || parseInt(values.hostValue, 10) > 99)) {
      errors.hostValue = 'Choose percentage value between 1 to 99';
    }
  }

  return errors
}

export default validate;
