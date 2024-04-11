import {gql} from 'react-apollo';
import { compileServiceFees } from '../../helpers/compileServiceFees';

import {
  GET_SERVICE_FEES_START,
  GET_SERVICE_FEES_SUCCESS,
  GET_SERVICE_FEES_ERROR, 
} from '../../constants';

const query = gql `
  query getServiceFees{
    getServiceFees{
        id
        guestType
        guestValue
        hostType
        hostValue
        currency
        status
    }
  }
`;

export function getServiceFees() {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: GET_SERVICE_FEES_START,
    });

    try {

      const {data} = await client.query({query});

      if(data && data.getServiceFees){
        let serviceFees = compileServiceFees(data.getServiceFees);

        dispatch({
          type: GET_SERVICE_FEES_SUCCESS,
          payload: {
            serviceFees: serviceFees
          }
        });

      }

    } catch (error) {
        dispatch({
          type: GET_SERVICE_FEES_ERROR,
          payload: {
            error
          }
        });
      return false;
    }

    return true;
  };
}
