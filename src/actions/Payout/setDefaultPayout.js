import {gql} from 'react-apollo';

import {
  SET_DEFAULT_PAYOUT_START,
  SET_DEFAULT_PAYOUT_SUCCESS,
  SET_DEFAULT_PAYOUT_ERROR, 
} from '../../constants';

import getPayoutsQuery from './getPayouts.graphql';

export function setDefaultPayout(id) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: SET_DEFAULT_PAYOUT_START,
    });

    try {

      let mutation = gql `
          mutation setDefaultPayout(
            $id: Int!, 
          ){
              setDefaultPayout(
                id: $id
              ) {
                  status
              }
          }
      `;

      const {data} = await client.mutate({
        mutation,
        variables: {
          id
        },
        refetchQueries: [{ query: getPayoutsQuery }]
      });

      if(data && data.setDefaultPayout) {
        dispatch({
          type: SET_DEFAULT_PAYOUT_SUCCESS,
          payload: {
            status: data.setDefaultPayout.status
          }
        });
      }

    } catch (error) {
        dispatch({
          type: SET_DEFAULT_PAYOUT_ERROR,
          payload: {
            error
          }
        });
      return false;
    }

    return true;
  };
}
