import {
    GET_AREA_ERROR,
    GET_AREA_SUCCESS,
} from '../constants';

export default function area(state = {}, action) {
    switch (action.type) {

        case GET_AREA_SUCCESS:
            return {
                ...state,
                areas: action.payload,
            };

        case GET_AREA_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
}
