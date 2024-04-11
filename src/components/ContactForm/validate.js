import messages from '../../locale/messages';

 const validate = values => {
    const errors = {}
     if (!values.name) {
         errors.name = messages.required;
     } else if (values.name.trim() == "") {
         errors.name = messages.blankSpace;
     }

     if (!values.email) {
         errors.email = messages.required;
     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(values.email)) {
         errors.email = messages.emailInvalid;
     }
    //   else if (values.email.trim() == "") {
    //      errors.email = messages.blankSpace;
    //  }

     if (!values.phoneNumber) {
         errors.phoneNumber = messages.required;
     } else if (values.phoneNumber.trim() == "") {
         errors.phoneNumber = messages.blankSpace;
     }
    
     if (!values.ContactMessage) {
         errors.ContactMessage = messages.required;
     } else if (values.ContactMessage.trim() == "") {
         errors.ContactMessage = messages.blankSpace;
     }

     if (!values.reCaptcha){
         errors.reCaptcha = messages.required;
     }
     return errors
}
export default validate
