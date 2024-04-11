import {
  CONTACT_HOST_OPEN,
  CONTACT_HOST_CLOSE,
} from '../../constants';

import { openLoginModal } from '../modalActions';
import history from '../../core/history';
import { reset } from 'redux-form';
export function contactHostOpen(listId, skipPhoneNumber) {

  return async (dispatch, getState, { client }) => {

    const isAuthenticated = getState().runtime.isAuthenticated;
    const account = getState().account.data;

    if (!isAuthenticated) {
      if (listId) {
        history.push('/login?refer=/rooms/' + listId);
      } else {
        dispatch(openLoginModal());
      }
      return false;
    } else if(!(account && account.verification && account.verification.isEmailConfirmed && (account.verification.isPhoneVerified || skipPhoneNumber))) {
      history.push('/book/' + listId + '?inquiry=true'); // +'?refer=/rooms/' + listId);
      return false;
    }

    dispatch({
      type: CONTACT_HOST_OPEN,
      payload: {
        showContactHostModal: true
      }
    });

    return true;
  };
}

export function contactHostClose() {

  return async (dispatch, getState, { client }) => {
    dispatch(reset('ContactHostForm'));
    dispatch({
      type: CONTACT_HOST_CLOSE,
      payload: {
        showContactHostModal: false
      }
    });

    return true;
  };
}