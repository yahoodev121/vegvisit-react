import { gql } from 'react-apollo';
import { reset, change } from 'redux-form';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import {
  SEARCH_LISTING_START,
  SEARCH_LISTING_SUCCESS,
  SEARCH_LISTING_ERROR
} from '../constants';

import { getSearchResults } from './getSearchResults';


const query = gql`
  query(
      $category: [Int],
      $listType: String,
      $personCapacity: Int,
      $dates: String,
      $currentPage: Int,
      $geography: String,
      $geoType: String,
      $lat: Float,
      $lng: Float,
      $sw_lat: Float, 
      $sw_lng: Float, 
      $ne_lat: Float, 
      $ne_lng: Float,
    ){
      SearchListing(
        category: $category,
        listType: $listType,
        personCapacity: $personCapacity,
        dates: $dates,
        currentPage: $currentPage,
        geography: $geography,
        geoType: $geoType,
        lat: $lat,
        lng: $lng,
        sw_lat: $sw_lat, 
        sw_lng: $sw_lng, 
        ne_lat: $ne_lat, 
        ne_lng: $ne_lng,
      ) {
        count
        results {
          id
          title
          personCapacity
          lat
          lng
          city
          state
          country
          timeZone
          beds
          bookingType
          coverPhoto
          reviewsCount,
          reviewsStarRating,
          kitchen,
          listPhotos {
            id
            name
            type
            status
          }
          listingData {
            basePrice
            currency
          }
          settingsData {
            listsettings {
              id
              itemName
              itemDescription
            }
          }
          listingRetreat {
            accommodations {
              type
              price
              deposit_percent
              description
              photos {
                name
                type
              }
            }
            teachers {
              name
              email
              is_yoga_alliance
              about
              photos {
                name
                type
              }
              location {
                country
                street
                buildingName
                city
                state
                zipCode
              }
            }
            eventType
            category
            title
            location
            country
            street
            city
            state
            zipcode
            lat
            lng
            subCategory
            RetreatStyle
            atmospheres
            yogaTypes
            skillLevels
            languageId
            benefits
            summary
            reviews
            showType
            includes
            not_includes
            special
            full_description
            instagram_url
            meal
            drink
            food
            currency
            retreat_dates
            duration
            min_days
            isAllowPayment
            isCash
            addons
            cancellationPolicy
            allow_flexibility
            use_increase_booking
            free_gift_name
            free_gift_desc
            itinerary
            localInfoDesc
            localInformation
            facilityFeatures
            seasonalInformation
            travelHelp
          }
          wishListStatus
          isListOwner
          listType
          experienceCategory
        }
      }
    }
`;

export function searchListing({ category, listType, personCapacity, dates, geography, currentPage, geoType, lat, lng, sw_lat, sw_lng, ne_lat, ne_lng, mapSearch }) {

  return async (dispatch, getState, { client }) => {

    dispatch({ type: SEARCH_LISTING_START });
    dispatch(reset('SearchForm'));

    try {
      console.log("search listing query:", query);
      const { data } = await client.query({
        query,
        variables: {
          category,
          listType,
          personCapacity,
          dates,
          currentPage,
          geography,
          geoType,
          lat,
          lng,
          sw_lat,
          sw_lng,
          ne_lat,
          ne_lng
        },
        fetchPolicy: 'network-only'
      });
      console.log("search listing result:", data);

      if (data.SearchListing) {
        dispatch({ type: SEARCH_LISTING_SUCCESS });
        await dispatch(change('SearchForm', 'personCapacity', personCapacity));
        await dispatch(change('SearchForm', 'dates', dates));
        await dispatch(change('SearchForm', 'geography', geography));
        await dispatch(change('SearchForm', 'currentPage', currentPage));
        await dispatch(change('SearchForm', 'geoType', geoType));
        await dispatch(change('SearchForm', 'lat', lat));
        await dispatch(change('SearchForm', 'lng', lng));
        mapSearch && await dispatch(change('SearchForm', 'searchByMap', true));
        await dispatch(change('SearchForm', 'sw_lat', sw_lat));
        await dispatch(change('SearchForm', 'sw_lng', sw_lng));
        await dispatch(change('SearchForm', 'ne_lat', ne_lat));
        await dispatch(change('SearchForm', 'ne_lng', ne_lng));
        await dispatch(change('SearchForm', 'initialLoad', true));
        await dispatch(change('SearchForm', 'markerHighlight', {}));
        // Default Map Show
        await dispatch(change('SearchForm', 'showMap', true));
        await dispatch(getSearchResults(data.SearchListing));
        dispatch(hideLoading());
      }
    } catch (error) {
      console.log('search listing error:', error)
      dispatch({
        type: SEARCH_LISTING_ERROR,
        payload: {
          error
        }
      });
      dispatch(hideLoading());
      return false;
    }

    return true;
  };
}
