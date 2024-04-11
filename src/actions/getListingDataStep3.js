import { gql } from 'react-apollo';

import {
  GET_LISTING_DATA_STEP3_START,
  GET_LISTING_DATA_STEP3_SUCCESS,
  GET_LISTING_DATA_STEP3_ERROR
} from '../constants';

import { initialize, change } from 'redux-form';

//moment
import moment from 'moment';
import 'moment-timezone';

const query = gql`
  query ($listId:String!, $preview: Boolean) {
    UserListing (listId:$listId, preview: $preview) {
      id
      userId
      bookingType
      isPublished
      timeZone
      houseRules {
        houseRulesId
      }
      listingData {
        bookingNoticeTime,
        checkInStart,
        checkInEnd,
        maxDaysNotice,
        minNight,
        maxNight,
        basePrice,
        securityDeposit,
        cleaningPrice,
        currency,
        weeklyDiscount,
        monthlyDiscount,
        cancellationPolicy,
        additionalRules
      }
      blockedDates {
        blockedDates
        reservationId
        calendarStatus
        isSpecialPrice
      }
      calendars {
        id
        name
        url
        listId
        status
      }
      listBlockedPrice {
          listId
          calendarStatus
          isSpecialPrice
          blockedDates
          calendarId
          reservationId
      }
    }
  }
`;

export function getListingDataStep3(listId) {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: GET_LISTING_DATA_STEP3_START,
    });

    try {
      let formValues = null;
      let settingFieldsData = {};
      const houseRules = [];
      const updatedBlockedDates = [];
      const updatedDisabledDates = [];
      const updatedAvailableDates = [];
      const updatedAvailableDatesPrices = [];

      let listData = {};
      let calendars = {};
      let listAvailablePrice = {};
      let listDataValues;

      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { listId, preview: true },
        fetchPolicy: 'network-only',
      });


      if (data && data.UserListing) {
        // Preparing List data
        listData = data.UserListing.listingData;
        calendars = data.UserListing.calendars;
        listAvailablePrice = data && data.UserListing.listAvailablePrice;

        // Preparing for house rules
        if (data.UserListing.houseRules.length > 0) {
          data.UserListing.houseRules.map((item, value) => {
            houseRules.push(parseInt(item.houseRulesId));
          });
          settingFieldsData = Object.assign({}, listData, { houseRules });
        }

        // Preparing for blocked dates
        // Dates shown on calendar shall correspond to dates for host time zone.
        // Since the calendar is related to local date we need to exchange the time zone information of blocked dates etc. to local time zone
        if (data.UserListing.blockedDates.length > 0 && data.UserListing.timeZone && moment.tz.guess()) {
          // let todayDate = moment.utc(new Date()).format('YYYY-MM-DD');
          let todayDate = moment().format('YYYY-MM-DD');
          data.UserListing.blockedDates.map((item, value) => {
            // let itemDate = moment.utc(item.blockedDates).format('YYYY-MM-DD');
            let itemDateObj = moment(item.blockedDates).tz(data.UserListing.timeZone).tz(moment.tz.guess(), true);
            let itemDate = itemDateObj.format('YYYY-MM-DD');
            if (itemDate >= todayDate) {
              if (item.reservationId != null) {
                updatedDisabledDates.push(new Date(itemDateObj.format('l LT')));
              } if (item.calendarStatus && item.calendarStatus === 'available') {
                updatedAvailableDates.push(new Date(itemDateObj.format('l LT')));
                updatedAvailableDatesPrices.push({
                  date: new Date(itemDateObj.format('l LT')),
                  isSpecialPrice: item.isSpecialPrice
                });
              } else {
                //https://stackoverflow.com/questions/28198626/display-datetime-with-momentjs-without-timezone-conversion
                //http://react-day-picker.js.org/docs/matching-days
                let finalDates = new Date(itemDateObj.format('l LT'));
                updatedBlockedDates.push(finalDates);
              }
            }
          });
          settingFieldsData = Object.assign({}, listData, settingFieldsData,
            {
              disabledDates: updatedDisabledDates,
              blockedDates: updatedBlockedDates,
              availableDates: updatedAvailableDates,
              availableDatesPrices: updatedAvailableDatesPrices,
            });
        }

        await dispatch(change('ListPlaceStep3', 'calendars', calendars));
        if (updatedBlockedDates) {
          await dispatch(change('ListPlaceStep3', 'blockedDates', updatedBlockedDates));
        } else if (updatedAvailableDates) {
          await dispatch(change('ListPlaceStep3', 'blockedDates', updatedAvailableDates));
        } else if (updatedAvailableDatesPrices) {
          await dispatch(change('ListPlaceStep3', 'blockedDates', updatedAvailableDatesPrices));
        }

        formValues = Object.assign({}, data.UserListing, settingFieldsData, listData, calendars);

        // Reinitialize the form values
        await dispatch(initialize('ListPlaceStep3', formValues));
        //await dispatch(initialize('ListPlaceStep3', formValues));
        // Dispatch a success action
        dispatch({
          type: GET_LISTING_DATA_STEP3_SUCCESS,
          step3DataIsLoaded: true,
          isExistingList: true,
          calendars: data.UserListing.calendars
        });
      } else {
        dispatch({
          type: GET_LISTING_DATA_STEP3_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_LISTING_DATA_STEP3_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }
    return true;
  };
}
