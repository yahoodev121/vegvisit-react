import messages from '../../locale/messages';


const validate = values => {

  const errors = {}

  if (!values.roomType) {
    errors.roomType = messages.required;
  }

  if (!values.houseType) {
    errors.houseType = messages.required;
  }

  // if (!values.residenceType) {
  //   errors.residenceType = messages.required;
  // }

  if (!values.personCapacity) {
    errors.personCapacity = messages.required;
  }

  if (!values.bedrooms && values.bedrooms !== 0) {
    errors.bedrooms = messages.required;
  }

  if (!values.beds && values.beds !== 0) {
    errors.beds = messages.required;
  }

  if (!values.bathrooms && values.bathrooms !== 0) {
    errors.bathrooms = messages.required;
  }

  /* if (!values.bathroomType) {
    errors.bathroomType = messages.required;
  } */

  if (!values.country) {
    errors.country = messages.required;
  }

  if (!values.street) {
    errors.street = messages.required;
  } else if (values.street && values.street.trim() == "") {
    errors.street = messages.blankSpace;
  }

  if (!values.city) {
    errors.city = messages.required;
  } else if (values.city && values.city.trim() == "") {
    errors.city = messages.blankSpace;
  }

  if (!values.state) {
    errors.state = messages.required;
  } else if (values.state && values.state.trim() == "") {
    errors.state = messages.blankSpace;
  }

  /* if (!values.zipcode) {
    errors.zipcode = messages.zipcodeRequired;
  } else if (values.zipcode && values.zipcode.trim() == "") {
    errors.zipcode = messages.blankSpace;
  } */

  return errors
}

export default validate
