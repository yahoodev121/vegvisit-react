import {
    GET_MEAL_ERROR,
    GET_MEAL_SUCCESS,
} from '../constants';

export default function meal(state = {}, action) {
    switch (action.type) {

        case GET_MEAL_SUCCESS:
            return {
                ...state,
                meals: action.payload,
            };

        case GET_MEAL_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
}
