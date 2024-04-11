import { sendForgotLink } from '../../../actions/ForgotPassword/sendForgotLink';

async function submit(values, dispatch) {
  dispatch(sendForgotLink(values.email, values.reCaptcha));
}

export default submit;
