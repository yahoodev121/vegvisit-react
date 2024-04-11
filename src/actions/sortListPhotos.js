import {
  SORT_LIST_PHOTOS_START,
  SORT_LIST_PHOTOS_SUCCESS,
  SORT_LIST_PHOTOS_ERROR } from '../constants';

export function sortListPhotos( listPhotos ) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: SORT_LIST_PHOTOS_START,
    });

    try {
      // Check if array has same length as before since here we just want to update sorting
      if(listPhotos && listPhotos.length === getState().location.listPhotos.length){
        dispatch({
          type: SORT_LIST_PHOTOS_SUCCESS,
          listPhotos: listPhotos,
        });
      } else {
        dispatch({
          type: SORT_LIST_PHOTOS_ERROR,
        });
      }
    } catch (error) {
        dispatch({
          type: SORT_LIST_PHOTOS_ERROR,
          payload:{
            error
          }
        });
      return false;
    }

    return true;
  };
}
