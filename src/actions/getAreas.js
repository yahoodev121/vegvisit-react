import { gql } from 'react-apollo';

import {
    GET_AREA_START,
    GET_AREA_SUCCESS,
    GET_AREA_ERROR
} from '../constants';

const query = gql`
    {
      getAreas {
        id
        name
      }
    }
`;

export function getAreaData() {

    return async (dispatch, getState, { client }) => {

        dispatch({
            type: GET_AREA_START,
        });

        try {
            // Send Request to get listing data
            const { data } = await client.query({ query, fetchPolicy: 'network-only' });

            if (data && data.getAreas) {
                dispatch({
                    type: GET_AREA_SUCCESS,
                    payload: data.getAreas
                });
            }
        } catch (error) {
            dispatch({
                type: GET_AREA_ERROR,
                payload: error
            });
            return false;
        }

        return true;
    };
}
