import messages from '../../locale/messages';

const validateStep2 = values => {

  const errors = {}

  if (!values.title) {
    errors.title = messages.required;
  } else if (values.title && values.title.trim() == "") {
    errors.title = messages.blankSpace;
  } else if (values.title && values.title.length > 80) {
    errors.title = messages.emptySpace;
  }

  if (!values.description) {
    errors.description = messages.required;
  } else if (values.description && values.description.trim() == "") {
    errors.description = messages.blankSpace;
  } 

  // if (!values.neighourhood) {
  //   errors.neighourhood = messages.required;
  // } else if (values.neighourhood && values.neighourhood.trim() == "") {
  //   errors.neighourhood = messages.blankSpace;
  // } 


  if (!values.kitchen) {
    errors.kitchen = messages.required;
  } else if (values.kitchen && values.kitchen.trim() == "") {
    errors.kitchen = messages.blankSpace;
  }

  // if (!values.nonVeg) {
  //   errors.nonVeg = messages.required;
  // } else if (values.nonVeg && values.nonVeg.trim() == "") {
  //   errors.nonVeg = messages.blankSpace;
  // }

  // if(values.aboutPlaces && values.aboutPlaces.trim() == "") {
  //   errors.aboutPlaces = messages.blankSpace;
  // }

  // if(values.aboutKitchen && values.aboutKitchen.trim() == "") {
  //   errors.aboutKitchen = messages.blankSpace;
  // }

  // if(values.neighourhood && values.neighourhood.trim() == "") {
  //   errors.neighourhood = messages.blankSpace;
  // }

  // if(values.notes && values.notes.trim() == "") {
  //   errors.notes = messages.blankSpace;
  // }

  // if(values.moreDetails && values.moreDetails.trim() == "") {
  //   errors.moreDetails = messages.blankSpace;
  // }

  return errors
}

export default validateStep2
