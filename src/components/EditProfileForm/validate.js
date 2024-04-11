import messages from '../../locale/messages';

const validate = values => {

  const errors = {}

  if (!values.firstName) {
    errors.firstName = messages.required;
  } else if (values.firstName && values.firstName.trim() == "") {
    errors.firstName = messages.blankSpace;
  }

  if (!values.lastName) {
    errors.lastName = messages.required;
  } else if (values.lastName && values.lastName.trim() == "") {
    errors.lastName = messages.blankSpace;
  }

  if (!values.email) {
    errors.email = messages.required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(values.email)) {
    errors.email = messages.emailInvalid;
  }

  // if (!values.gender) {
  //   errors.gender = messages.genderRequired;
  // }

  if (!values.phoneNumber) {
    errors.phoneNumber = messages.required;
  } else if (values.phoneNumber && values.phoneNumber.trim() == "") {
    errors.phoneNumber = messages.blankSpace;
  } else if(isNaN(values.phoneNumber)) {
    errors.phoneNumber = messages.phoneNumberInvalid;
  }


  // if (!values.preferredLanguage) {
  //   errors.preferredLanguage = messages.preferredLanguageRequired;
  // }

  if (!values.preferredCurrency) {
    errors.preferredCurrency = messages.required;
  }

  // if (!values.location) {
  //   errors.location = messages.locationRequired;
  // } else if (values.location && values.location.trim() == "") {
  //   errors.location = messages.blankSpace;
  // }

  if (!values.info) {
    errors.info = messages.required;
  } else if (values.info && values.info.trim() == "") {
    errors.info = messages.blankSpace;
  }

  // if (!values.dateOfBirth) {
  //   errors.dateOfBirth = messages.dateOfBirthRequired;
  // }

  if (!values.foodCategory) {
    errors.foodCategory = messages.required;
  }

  // if (values.lifestyle && values.lifestyle.trim() == "") {
  //   errors.lifestyle = messages.blankSpace;
  // }

  if (!values.month && values.month !== 0) {
    errors.month = messages.monthRequired;
  }

  if (!values.day) {
    errors.day = messages.dayRequired;
  }

  if (!values.year) {
    errors.year = messages.yearRequired;
  }

  // if (values.year) {
  //   let now = new Date();
  //   let currentYear = now.getFullYear();
  //   let difference = currentYear - values.year;
  //   if(difference < 18) {
  //     errors.year = messages.mustBe18OrOld;
  //   }
  // }
  

  return errors
}

export default validate
