import {
  OPEN_LIST_SETTINGS_MODAL,
  CLOSE_LIST_SETTINGS_MODAL,
  OPEN_LIST_SETTINGS_MANAGE_MODAL,
  CLOSE_LIST_SETTINGS_MANAGE_MODAL } from '../../constants';

import { initialize } from 'redux-form';

export function openListSettingsModal(initialData, formName) {

  return (dispatch, getState) => {

    // Reinitialize the form values
    dispatch(initialize(formName, initialData , true));

    dispatch({
      type: OPEN_LIST_SETTINGS_MODAL,
      listSettingsModal: true,
    });
  };

}

export function openEditListSettingsModal(initialData) {

  return (dispatch, getState) => {

    // Reinitialize the form values
    dispatch(initialize("EditListSettingsForm", initialData , true));

    dispatch({
      type: OPEN_LIST_SETTINGS_MODAL,
      listSettingsModal: true,
    });
  };

}

export function closeListSettingsModal() {

  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_LIST_SETTINGS_MODAL,
      listSettingsModal: false
    });
  };

}
