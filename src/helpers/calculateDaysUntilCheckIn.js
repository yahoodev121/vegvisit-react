import { Client } from '@googlemaps/google-maps-services-js';
import moment from 'moment';

import { googleMapAPI } from '../config';
import isValidNumber from './isValidNumber';

/**
 * Rerturn the number of days until check-in for the specified timezone
 * @param {*} checkinDateString Check-in date string
 * @param {*} now The date for which the time difference is calculated
 * @param {*} timezone The timezone string
 * @param {*} hours Check-in time hours
 * @param {*} minutes Check-in time minutes
 * @param {*} seconds Check-in time seconds
 */
export function calculateDaysUntilCheckin(checkinDateString, now, timezone, hours, minutes, seconds) {
    try {
      const checkInHost = moment.tz(checkinDateString, timezone);
      // set to the right time
      checkInHost.hour(hours);
      checkInHost.minute(minutes);
      checkInHost.second(seconds);
      let daysRemainingUntilCheckIn = checkInHost.diff(now, 'days');
      if (checkInHost.diff(now) < 0) {
        daysRemainingUntilCheckIn -= 1;
      }
      return daysRemainingUntilCheckIn;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Days until checkin could not be calculated: ${error.message}`, error, timezone, checkinDateString);
      return undefined;
    }
}

/**
 * Get the timezone for a specific coordinate and point in time
 * @param {*} now The point in time for which the timezone is calculated
 * @param {*} lat Latitude
 * @param {*} lng Longitude
 */
export async function getTimezone(now, lat, lng) {

  if (!(now && isValidNumber(Number(lat)) && isValidNumber(Number(lng)))) {
    return undefined;
  }

  const nowTimestamp = now.valueOf();
  const nowTimestampSeconds = Math.round(nowTimestamp / 1000);

  const client = new Client({});
  const timezoneResult = await client
    .timezone({
      params: {
        location: { lat, lng },
        key: googleMapAPI,
        timestamp: nowTimestampSeconds,
      },
      timeout: 1000, // milliseconds
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
  if (timezoneResult && timezoneResult.data && timezoneResult.data.status === 'OK' && timezoneResult.data.timeZoneId) {
    return timezoneResult.data.timeZoneId;
  }
  const errMessage = timezoneResult && timezoneResult.data ? timezoneResult.data.errorMessage : 'No error message';
  // eslint-disable-next-line no-console
  console.error(`Timezone error: ${errMessage}`, timezoneResult, now, lat, lng);
  return undefined;
}