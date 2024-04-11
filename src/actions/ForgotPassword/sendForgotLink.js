import {gql} from 'react-apollo';
import {toastr} from 'react-redux-toastr';

import {
  SEND_FORGOT_PASSWORD_START,
  SEND_FORGOT_PASSWORD_SUCCESS,
  SEND_FORGOT_PASSWORD_ERROR, 
} from '../../constants';

import { closeForgotPasswordModal } from '../modalActions';
import {sendEmail} from '../../core/email/sendEmail';
import messages from '../../locale/messages';
import { intl } from '../../store/IntlGlobalProvider';

export function sendForgotLink(email, reCaptcha) {

  return async (dispatch, getState, { client, formatMessage }) => {

    dispatch({
      type: SEND_FORGOT_PASSWORD_START,
    });

    dispatch(closeForgotPasswordModal());

    try {

      let mutation = gql `
        mutation sendForgotPassword($email: String!) {
          sendForgotPassword (email: $email) {
            id
            email
            token
            userId
            status
            profile {
              firstName
            }
          }
        }
      `;

      // Send Message
      const {data} = await client.mutate({
        mutation,
        variables: {
          email
        }
      });

      if(data && data.sendForgotPassword) {

        if(data.sendForgotPassword.status === 'notAvailable') {
          toastr.error("Send Reset Link Failed", "No account exists for the given email id");
          return false;
        } 
        if(data.sendForgotPassword.status === '400') {
          toastr.error("Send Reset Link Failed", "Something went wrong, please try again later");
          return false;
        }
        toastr.success("Reset Link Sent to your email", intl.formatMessage(messages.night));
        let content = {
          token: data.sendForgotPassword.token,
          email:  data.sendForgotPassword.email,
          name: data.sendForgotPassword.profile.firstName,
          reCaptcha
        };
        await sendEmail(email, 'forgotPasswordLink', content);
        dispatch({
          type: SEND_FORGOT_PASSWORD_SUCCESS,
        });
      }

    } catch (error) {
        dispatch({
          type: SEND_FORGOT_PASSWORD_ERROR,
          payload: {
            error
          }
        });
      return false;
    }

    return true;
  };
}