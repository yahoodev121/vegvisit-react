import {
  OPEN_LIST_SETTINGS_MODAL,
  CLOSE_LIST_SETTINGS_MODAL } from '../../constants';

export default function adminModalStatus(state = {}, action) {
  switch (action.type) {

    case OPEN_LIST_SETTINGS_MODAL:
      return {
        ...state,
        listSettingsModal: action.listSettingsModal,
      };

    case CLOSE_LIST_SETTINGS_MODAL:
      return {
        ...state,
        listSettingsModal: action.listSettingsModal
      };

    default:
      return {
        ...state,
      };
  }
}
