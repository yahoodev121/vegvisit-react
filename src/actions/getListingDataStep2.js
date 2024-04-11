import { gql } from 'react-apollo';

import {
  GET_LISTING_DATA_STEP2_START,
  GET_LISTING_DATA_STEP2_SUCCESS,
  GET_LISTING_DATA_STEP2_ERROR
} from '../constants';

import { initialize } from 'redux-form';

const query = gql`
  query ($listId:String!, $preview: Boolean) {
    UserListing (listId:$listId, preview: $preview) {
      id
      userId
      title
      description
      kitchen
      nonVeg
      aboutPlaces
      aboutKitchen
      neighourhood
      notes
      moreDetails
      coverPhoto
      userServices {
        serviceId
        listsettings{
          itemName
          settingsType {
            typeName
          }
        }
      }
    }
  }
`;

export function getListingDataStep2(listId) {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: GET_LISTING_DATA_STEP2_START,
    });

    try {
      let formValues = null;
      const services = [];
      let settingFieldsData = {};
      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { listId, preview: true },
        fetchPolicy: 'network-only',
      });
      // Preparing for user amenities
      if (data.UserListing.userServices.length > 0) {
        data.UserListing.userServices.map((item, value) => {
          services.push(parseInt(item.serviceId));
        });
        settingFieldsData = Object.assign({}, settingFieldsData, { services });
      }

      formValues = Object.assign({}, data.UserListing, settingFieldsData);

      if (formValues != null) {
      if (data && data.UserListing) {
        // Reinitialize the form values
        // await dispatch(initialize('ListPlaceStep2', formValues , true));
        await dispatch(initialize('ListPlaceStep2', formValues));
        // Dispatch a success action
        dispatch({
          type: GET_LISTING_DATA_STEP2_SUCCESS,
          step2DataIsLoaded: true,
          isExistingList: true,
        });
      }
    }
    } catch (error) {
      dispatch({
        type: GET_LISTING_DATA_STEP2_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }

    return true;
  };
}
