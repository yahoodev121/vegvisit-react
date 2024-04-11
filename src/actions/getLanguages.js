import { gql } from 'react-apollo';

import {
    GET_LANGUAGE_START,
    GET_LANGUAGE_SUCCESS,
    GET_LANGUAGE_ERROR
} from '../constants';

const query = gql`
    {
      getLanguages {
        id
        name
      }
    }
`;

export function getLanguageData() {

    return async (dispatch, getState, { client }) => {

        dispatch({
            type: GET_LANGUAGE_START,
        });

        try {
            // Send Request to get listing data
            const { data } = await client.query({ query, fetchPolicy: 'network-only' });

            if (data && data.getLanguages) {
                dispatch({
                    type: GET_LANGUAGE_SUCCESS,
                    payload: data.getLanguages
                });
            }
        } catch (error) {
            dispatch({
                type: GET_LANGUAGE_ERROR,
                payload: error
            });
            return false;
        }

        return true;
    };
}
