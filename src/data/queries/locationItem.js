import LocationItemType from '../types/LocationItemType';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import moment from 'moment';

import fetch from '../../core/fetch';

import { getTimezone } from '../../helpers/calculateDaysUntilCheckIn';

// Constants
import { googleMapAPI } from '../../config';

const locationItem = {

  type: LocationItemType,

  args: {
    address: { type: StringType },
  },

  async resolve({ request }, { address }) {

    const URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) + '&key=' + googleMapAPI;
    const resp = await fetch(URL);
    const data = await resp.json();
    let locationData = {};
    if(data && data.results && data.results.length > 0) {
      data.results.map((item, key) => {
        item.address_components.map((value, key) => {
          if(value.types[0] == 'administrative_area_level_1' || value.types[0] == 'country') {
            locationData[value.types[0]] = value.short_name;
          } else {
            locationData[value.types[0]] = value.long_name;
          }

        });
      });

      // let city = locationData.locality != undefined ? locationData.locality : locationData.administrative_area_level_1;
      // let city = locationData.locality != undefined ? locationData.locality : '' ;
      let city = locationData.locality != undefined ? locationData.locality : locationData.administrative_area_level_2;
      let streetNumber = locationData.street_number != undefined ? locationData.street_number + ' ' + locationData.route : locationData.route;

      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;
      const now = moment();
      const timeZone = await getTimezone(now, lat, lng);

      if (timeZone) {
        return {
          street: streetNumber,
          country: locationData.country,
          city: city,
          state: locationData.administrative_area_level_1,
          zipcode: locationData.postal_code,
          lat: lat,
          lng: lng,
          timeZone: timeZone,
          status: 200
        }
      } else {
        return {
          status: 400
        }
      }
    } else {
      return {
        status: 400
      }
    }

  },
};

export default locationItem;
