import {gql} from 'react-apollo';

import {
  GET_DIETS_DATA_START,
  GET_DIETS_DATA_SUCCESS,
  GET_DIETS_DATA_ERROR } from '../constants';

const query = gql`
  {
    getDiets {
      id
      dietName
      isEnable
    }
  }
`;

export function getDiets() {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: GET_DIETS_DATA_START,
    });

    try {
      // Send Request to get listing data
      const {data} = await client.query({ query, fetchPolicy: 'network-only' });

      if(!(data && data.getDiets)){
        dispatch({
          type: GET_DIETS_DATA_ERROR,
        });
      } else {
          dispatch({
            type: GET_DIETS_DATA_SUCCESS,
            diets: data.getDiets
          });
      }
    } catch (error) {
        dispatch({
          type: GET_DIETS_DATA_ERROR,
          payload:{
            error
          }
        });
      return false;
    }
    return true;
  };
}
