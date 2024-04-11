import moment from 'moment';
import 'moment-timezone';
import Sequelize from 'sequelize';

import { ListBlockedDates, ListingData, Listing } from '../../data/models';
import logger from '../logger';

export async function checkAvailableDates(listId, checkIn, checkOut) {

  const listingData = await ListingData.findOne({
    where: {
      listId,
    },
  });

  if (!listingData) {
    return {
      status: 500, // There should always be a listingData record
    };
  }

  const listing = await Listing.findOne({
    where: {
      id: listId,
    },
  })

  if (!(listing && listing.timeZone)) {
    return {
      status: 500, // There should always be a listing with a defined time zone
    };
  }

  const checkInDate = moment.utc(checkIn).tz(listing.timeZone);
  const checkOutDate = moment.utc(checkOut).tz(listing.timeZone);
  const now = moment().tz(listing.timeZone);

  const reservationDatesValidityStatus = checkReservationDatesValidity(
    checkInDate,
    checkOutDate,
    now
  );
  if (reservationDatesValidityStatus.status !== 200) {
    return reservationDatesValidityStatus;
  }
 
  const listingDatesValidityStatus = checkListingDatesValidity(checkInDate, checkOutDate, now, listingData.maxDaysNotice, listingData.minNight, listingData.maxNight);

  if (listingDatesValidityStatus.status !== 200) {
    return listingDatesValidityStatus;
  }

  return await checkBlockedDates(listId, checkInDate, checkOutDate);
}

export function checkReservationDatesValidity(checkInDate, checkOutDate, now) {

  if (!checkInDate.isValid() || !checkOutDate.isValid()) {
    return {
      status: 'invalidDates',
    };
  }
  if (checkInDate.isBefore(now, 'days')) {
    return {
      status: 'checkInIsInPast',
    };
  }
  // In case checkout is when daylight saving time becomes active it might only be 23
  if (checkOutDate.diff(checkInDate, 'days') < 1) {
    return {
      status: 'checkOutBeforeCheckInOrSameDay',
    };
  }
  return {
    status: 200,
  };
}

export function checkListingDatesValidity(checkInDate, checkOutDate, now, maxDaysNotice, minNight, maxNight) {
  if (maxDaysNotice) {
    let latestCheckInDate;
    switch (maxDaysNotice) {
      case 'unavailable':
        return {
          status: 'unavailable',
        };
      case '3months':
        latestCheckInDate = now.clone().add(3, 'months');
        if (checkInDate.diff(latestCheckInDate, 'days') > 0) {
          return {
            status: '3monthsNoticeExceeded',
          };
        }
        break;
      case '6months':
        latestCheckInDate = now.clone().add(6, 'months');
        if (checkInDate.diff(latestCheckInDate, 'days') > 0) {
          return {
            status: '6monthsNoticeExceeded',
          };
        }
        break;
      case '9months':
        latestCheckInDate = now.clone().add(9, 'months');
        if (checkInDate.diff(latestCheckInDate, 'days') > 0) {
          return {
            status: '9monthsNoticeExceeded',
          };
        }
        break;
      case '12months':
        latestCheckInDate = now.clone().add(12, 'months');
        if (checkInDate.diff(latestCheckInDate, 'days') > 0) {
          return {
            status: '12monthsNoticeExceeded',
          };
        }
        break;
      default:
    }
  } else {
    return {
      status: 500, // There should always be a value
    };
  }

  const nights = checkOutDate.diff(checkInDate, 'days');
  if (minNight) {
    const minNights = Number(minNight);
    if (Number.isInteger(minNights) && nights < minNights) {
      return {
        status: 'lessThanMinNights' + minNights,
      };
    }
  }

  if (maxNight) {
    const maxNights = Number(maxNight);
    if (Number.isInteger(maxNights) && maxNights > 0 && nights > maxNights) {
      return {
        status: 'moreThanMaxNights' + maxNights,
      };
    }
  }

  return {
    status: 200
  }
}

export async function checkBlockedDates(listId, checkInDate, checkOutDate) {
  logger.debug(`core.reservation.checkAvailableDates.checkBlockedDates: Checking blocked dates for Listing ${listId}, check-in ${checkInDate} and check-out ${checkOutDate}`);
  const Op = Sequelize.Op;
  const checkBlockedDates = await ListBlockedDates.findAll({
    where: {
      listId,
      blockedDates: {
        // exclude check out
        [Op.between]: [
          checkInDate
            .subtract(3, 'hours')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss'),
          checkOutDate
            .subtract(3, 'hours')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss'),
        ],
      },
      calendarStatus: {
        [Op.eq]: ['blocked'],
      },
    },
  });

  if (checkBlockedDates && checkBlockedDates.length > 0) {
    logger.debug(`core.reservation.checkAvailableDates.checkBlockedDates: Check for Listing ${listId}, check-in ${checkInDate} and check-out ${checkOutDate} resulted in: ${JSON.stringify(checkBlockedDates)}`);
    return {
      status: 'blocked',
    };
  } else {
    return {
      status: '200',
    };
  }
}