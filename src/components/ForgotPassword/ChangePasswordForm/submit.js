// Toaster
import {toastr} from 'react-redux-toastr';

import {updatePassword} from '../../../actions/ForgotPassword/updateForgotPassword';

async function submit(values, dispatch) {

  if(values.newPassword != values.confirmPassword){
      toastr.error("Change Password Failed", "Confirm password is mismatching with new password");
      return;
  }

  dispatch(updatePassword(values.email, values.newPassword))

}

export default submit;
