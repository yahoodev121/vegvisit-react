import { gql } from "react-apollo";

import {
  GET_CATEGORIES_START,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_ERROR,
} from "../constants";

const query = gql`
  {
    getCategories {
      id
      name
      parentId
      eventType
    }
  }
`;

export function getCategoriesData() {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: GET_CATEGORIES_START,
    });

    try {
      // Send Request to get listing data
      const { data } = await client.query({
        query,
        fetchPolicy: "network-only",
      });
      console.log("category action:", data);

      if (data && data.getCategories) {
        dispatch({
          type: GET_CATEGORIES_SUCCESS,
          payload: data.getCategories,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_CATEGORIES_ERROR,
        payload: error,
      });
      return false;
    }

    return true;
  };
}
