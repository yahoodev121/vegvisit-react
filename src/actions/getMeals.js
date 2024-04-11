import { gql } from 'react-apollo';

import {
    GET_MEAL_START,
    GET_MEAL_SUCCESS,
    GET_MEAL_ERROR
} from '../constants';

const query = gql`
    {
      getMeals {
        id
        mealType
        mealIcon
      }
    }
`;

export function getMealData() {

    return async (dispatch, getState, { client }) => {

        dispatch({
            type: GET_MEAL_START,
        });

        try {
            // Send Request to get listing data
            const { data } = await client.query({ query, fetchPolicy: 'network-only' });

            if (data && data.getMeals) {
                dispatch({
                    type: GET_MEAL_SUCCESS,
                    payload: data.getMeals
                });
            }
        } catch (error) {
            dispatch({
                type: GET_MEAL_ERROR,
                payload: error
            });
            return false;
        }

        return true;
    };
}
