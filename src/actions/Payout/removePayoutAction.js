import {gql} from 'react-apollo';

import {
  REMOVE_PAYOUT_START,
  REMOVE_PAYOUT_SUCCESS,
  REMOVE_PAYOUT_ERROR, 
} from '../../constants';

import getPayoutsQuery from './getPayouts.graphql';

export function removePayout(id) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: REMOVE_PAYOUT_START,
    });

    try {

      let mutation = gql `
          mutation removePayout(
            $id: Int!, 
          ){
              removePayout(
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

      if(data && data.removePayout) {
        dispatch({
          type: REMOVE_PAYOUT_SUCCESS,
          payload: {
            status: data.removePayout.status
          }
        });
      }

    } catch (error) {
        dispatch({
          type: REMOVE_PAYOUT_ERROR,
          payload: {
            error
          }
        });
      return false;
    }

    return true;
  };
}
