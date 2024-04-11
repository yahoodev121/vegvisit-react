import React from 'react';
import FooterLessLayout from '../../components/Layout/FooterLessLayout';
import Search from './Search';
import fetch from '../../core/fetch';

import { searchListing } from '../../actions/searchListing';
import { setPersonalizedValues } from '../../actions/personalized';
import { getMealData } from '../../actions/getMeals';
import { getHomeBannerImages } from '../../actions/getHomeBannerImages';

import { showLoading, hideLoading } from 'react-redux-loading-bar'

import moment from 'moment';
import { getAreaData } from '../../actions/getAreas';
import { getLanguageData } from '../../actions/getLanguages';

const title = 'Search';

export default {

  path: '/s',

  async action({ params, store, query }) {

    await store.dispatch(getHomeBannerImages());

    store.dispatch(showLoading());
    store.dispatch(getMealData());
    store.dispatch(getAreaData());
    store.dispatch(getLanguageData());

    // Fetch Search Settings
    const searchQuery = `
      {
        getSearchSettings {
          minPrice
          maxPrice
          priceRangeCurrency
        }
      }
    `;

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
      }),
      credentials: 'include',
    });

    const { data } = await resp.json();

    // From Redux Store
    const layoutType = store.getState().siteSettings.data.homePageType;
    const geographyData = store.getState().personalized.geography;
    const personCapacityData = store.getState().personalized.personCapacity;
    const categoryId = store.getState().personalized.category;
    const startDateData = store.getState().personalized.startDate;
    const endDateData = store.getState().personalized.endDate;
    let geoType = store.getState().personalized.geoType;
    let lat = store.getState().personalized.lat;
    let lng = store.getState().personalized.lng;
    let sw_lat = store.getState().personalized.sw_lat;
    let sw_lng = store.getState().personalized.sw_lng;
    let ne_lat = store.getState().personalized.ne_lat;
    let ne_lng = store.getState().personalized.ne_lng;
    let personCapacity, category, dates, geography, currentPage = 1;
    let listType = query.listType;
    let initialFilter = { listType };

    // Geography Data
    // if(geographyData != undefined && geographyData != null) {
    //   geography = geographyData;
    // } else {
    if ("address" in query && encodeURI(query.address)) {
      let latAndLngQuery = `
            query ($address: String) {
              GetAddressComponents (address:$address) {
                addressComponents
                lat
                lng
                geoType
                sw_lat 
                sw_lng 
                ne_lat 
                ne_lng
              }
            }
          `;
      const locationResp = await fetch('/graphql', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: latAndLngQuery,
          variables: { address: query.address }
        }),
        credentials: 'include',
      });

      const { data } = await locationResp.json();
      if (data && data.GetAddressComponents) {
        initialFilter["address"] = query.address;
        initialFilter["geography"] = data.GetAddressComponents.addressComponents;
        initialFilter["lat"] = data.GetAddressComponents.lat;
        initialFilter["lng"] = data.GetAddressComponents.lng;
        initialFilter["sw_lat"] = data.GetAddressComponents.sw_lat;
        initialFilter["sw_lng"] = data.GetAddressComponents.sw_lng;
        initialFilter["ne_lat"] = data.GetAddressComponents.ne_lat;
        initialFilter["ne_lng"] = data.GetAddressComponents.ne_lng;
        geography = data.GetAddressComponents.addressComponents;
        geoType = data.GetAddressComponents.geoType;
        lat = data.GetAddressComponents.lat;
        lng = data.GetAddressComponents.lng;
        sw_lat = data.GetAddressComponents.sw_lat,
          sw_lng = data.GetAddressComponents.sw_lng,
          ne_lat = data.GetAddressComponents.ne_lat,
          ne_lng = data.GetAddressComponents.ne_lng
        await store.dispatch(setPersonalizedValues({ name: 'location', value: query.address }));
      }
    } else {
      lat = null;
      lng = null;
    }
    // }

    // PersonCapacity
    if (personCapacityData != undefined && personCapacityData != null) {
      personCapacity = personCapacityData;
    } else {
      if ("guests" in query && query.guests) {
        initialFilter["personCapacity"] = Number(query.guests);
        personCapacity = Number(query.guests);
      }
    }

    // Category
    if ("category" in query && query.category) {
      initialFilter["category"] = Number(query.category);
      category = Number(query.category);
      store.dispatch(setPersonalizedValues({ name: 'category', value: category }));
    }

    /*
      Since blocked dates are saved in utc converted from host time zone
      and the difference might be up to 14 hours (but only +, - is up to -12),
      we will make sure that no listing is excluded by mistake and therefore narrow the times accordingly
    */
    if (startDateData != undefined && startDateData != null && endDateData != undefined && endDateData != null) {
      // dates = `'${startDateData}' AND '${endDateData}'`;
      dates = calcBetweenClause(startDateData, endDateData);
    } else {
      if ("startDate" in query && "endDate" in query && query.startDate && query.endDate) {
        initialFilter["startDate"] = query.startDate;
        initialFilter["endDate"] = query.endDate;
        // dates = `'${query.startDate}' AND '${query.endDate}'`;
        dates = calcBetweenClause(query.startDate, query.endDate);
      }
    }
    // Default Map Show
    store.dispatch(setPersonalizedValues({ name: 'showMap', value: true }));
    store.dispatch(setPersonalizedValues({ name: 'searchType', value: query.listType }));

    let mapSearch = false;
    if (query && query.mapSearch && query.mapSearch !== '0') {
      mapSearch = true;
    }
    await store.dispatch(searchListing({ category, listType, personCapacity, dates, geography, currentPage, geoType, lat, lng, sw_lat, sw_lng, ne_lat, ne_lng, mapSearch }))

    return {
      title,
      component: <FooterLessLayout page={'search'} layoutType={layoutType} searchType={query.listType}><Search
        initialFilter={initialFilter}
        searchSettings={data.getSearchSettings}
        layoutType={layoutType}
        searchType={query.listType}
      />
      </FooterLessLayout>,
    };
  },

};

function calcBetweenClause(startDate, endDate) {
  let startDateNew = moment(startDate).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
  let endDateNew = moment(endDate).subtract(1, 'days').hour(21).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
  let dates = ` CAST('${startDateNew}' AS DATETIME) AND CAST('${endDateNew}' AS DATETIME) `;
  // The dates string is checked on server side for exactly this pattern to avoid swql injection
  // see src/data/queries/SearchListing.js
  // Therefore in case we make any changes here then we also need to change the server side validation!
  return dates;
}

