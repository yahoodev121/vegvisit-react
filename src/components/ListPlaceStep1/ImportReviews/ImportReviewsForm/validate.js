import messages from '../../../../locale/messages';

const validate = (values) => {
  const errors = {};
  function isValidAirbnbURL(str) {
    let isValid = true;
    let a = document.createElement('a');
    a.href = str;
    if (
      !a.hostname.match(/^[A-Za-z]+\.airbnb(\.[A-Za-z]+){1,2}$/) ||
      !a.pathname.match(/\/rooms\/[0-9]+$|\/(?=$|reviews$)/)
    ) {
      isValid = false;
    }
    return isValid;
  }

  if (!values.url) {
    errors.url = messages.required;
  } else if (values.url.trim() == '') {
    errors.url = messages.blankSpace;
  } else if (values.url && values.url.length > 255) {
    errors.url = messages.exceedLimit;
  } else if (!isValidAirbnbURL(values.url)) {
    errors.url = messages.invalidAirbnbRoomsUrl;
  }

  return errors;
};

export default validate;
