import messages from '../../../locale/messages'
const validate = values => {

  const errors = {}

  if (!values.siteName) {
    errors.siteName = messages.required;
  }

  if (!values.siteTitle) {
    errors.siteTitle = messages.required;
  }

  if (values.logoHeight) {
    if (isNaN(values.logoHeight)) {
      errors.logoHeight = 'Logo height must be numeric value';
    }
  }

  if (values.logoWidth) {
    if (isNaN(values.logoWidth)) {
      errors.logoWidth = 'Logo width must be numeric value';
    }
  }

  if(values.metaDescription && values.metaDescription.length > 255) {
    errors.metaDescription = 'Description must be 255 characters or less'
  }

  if(values.metaKeyword && values.metaKeyword.length > 255) {
    errors.metaKeyword = 'Keyword must be 255 characters or less'
  }

  // if (!values.videoLink) {
  //   errors.videoLink = "Invalid Address";
  // } else if (values.videoLink.trim() == "") {
  //   errors.videoLink = "Invalid Address";
  //   errors.videoLink = "Invalid Address";
  // } else if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.videoLink)) {
  //   errors.videoLink = "Invalid Address";
  // }

  return errors
}

export default validate;
