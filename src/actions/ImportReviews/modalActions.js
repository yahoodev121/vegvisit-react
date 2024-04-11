import {
  OPEN_IMPORT_REVIEWS_MODAL,
  CLOSE_IMPORT_REVIEWS_MODAL } from '../../constants';

import { initialize } from 'redux-form';
import {
  openLoginModal
} from '../../actions/modalActions';

export function openImportReviewsModal(listId) {

  return (dispatch, getState) => {
    let isAuthenticated = getState().runtime.isAuthenticated;

    if (isAuthenticated) {
      dispatch({
        type: OPEN_IMPORT_REVIEWS_MODAL,
        payload: {
          importReviewsModalOpen: true,
          listId: listId
        }
      });
    } else {
      dispatch(openLoginModal());
    }
  };

}

export function closeImportReviewsModal() {

  return (dispatch, getState) => {
      dispatch({
        type: CLOSE_IMPORT_REVIEWS_MODAL,
        payload: {
          importReviewsModalOpen: false
        }
      });
  };

}
