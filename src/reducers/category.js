import {
  GET_CATEGORIES_ERROR,
  GET_CATEGORIES_SUCCESS,
} from '../constants';

export default function category(state = {}, action) {
  switch (action.type) {

    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
      };

    case GET_CATEGORIES_ERROR:
      return {
        ...state,
        error: action.payload,
      };
      
    default:
      return state;
  }
}
