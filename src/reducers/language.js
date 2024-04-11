import {
    GET_LANGUAGE_ERROR,
    GET_LANGUAGE_SUCCESS,
} from '../constants';

export default function LANGUAGE(state = {}, action) {
    switch (action.type) {

        case GET_LANGUAGE_SUCCESS:
            return {
                ...state,
                languages: action.payload,
            };

        case GET_LANGUAGE_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
}
