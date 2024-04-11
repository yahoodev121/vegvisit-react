import { GET_DIETS_DATA_SUCCESS } from '../constants';

export default function getDiets(state = {}, action) {
  switch (action.type) {
    case GET_DIETS_DATA_SUCCESS:
      return {
        ...state,
        data: action.diets,
      };
    default:
      return state;
  }
}
