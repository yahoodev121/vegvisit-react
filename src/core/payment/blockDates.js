import { Reservation, ListBlockedDates, Listing } from '../../data/models';
import moment from 'moment';
import 'moment-timezone';
import sequelize from 'sequelize';
import logger from '../logger';

export async function blockDates(
  reservationId
) {
  const reservation = await Reservation.findOne({
    where: {
      id: reservationId,
    }
  });

  const listing = await Listing.findOne({
    where: {
      id: reservation.listId,
    }
  })

  const timeZone = listing.timeZone;

  if (reservation && timeZone) {
    let dates = [];
    // If there is a change in the daylight savings time we cannot compare the dates correctly without a time zone, 
    // they might differ up to one hour or even more in certain constellations of host, server and client time zone
    // And we also want to set the right time for the blocked dates according to the respective daylight savings setting
    // Therefore let's take the time zone into account
    const start = moment(reservation.checkIn).tz(timeZone);
    const end = moment(reservation.checkOut).tz(timeZone);
    // To make it more robust concerning wrong time settings let's apply a buffer, 
    // we need to make sure check out is not blocked and would have a buffer up to 24 hours for that 
    const endWithBuffer = end.clone().add(-3, 'hours');
    
    let blockedDate = start.clone();   
    do {
      dates.push(blockedDate.clone());
      blockedDate.add(1, 'days');
      if (blockedDate >= endWithBuffer && !blockedDate.isSame(end)) {
        logger.warn(`core.payment.blockDates.blockDates: Following data was not added to the blocked dates for reservation ${reservation.id}: ${blockedDate.format()}
          but there seems to be an issue with the time settings. Check in is ${start.format()}, check out ${end.format()}`);
      }
    } while (blockedDate < endWithBuffer);

    dates.map(async (blockedDates) => {

      // day = moment(blockedDates).utc().format('YYYY-MM-DD HH:mm:ss');
      // let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);

      let blockedDatesFind = await ListBlockedDates.findAll({
        where: {
          blockedDates,
          listId: reservation.listId,
          calendarStatus: 'available'
        }
      });

      let blockfindDates, createdDates, updateDates;
      let chooseDates = moment(moment(blockedDates)).utc().format('YYYY-MM-DD');

      blockedDatesFind.map(async (value, keys) => {
        blockfindDates = moment(value.blockedDates).utc().format('YYYY-MM-DD');
        if (chooseDates == blockfindDates) {
          updateDates = await ListBlockedDates.update({
            listId: reservation.listId,
            blockedDates: blockedDates,
            calendarStatus: 'blocked',
            reservationId,
          },
            {
              where: {
                listId: reservation.listId,
                blockedDates: blockedDates
              }
            });
        } else {
          createdDates = await ListBlockedDates.findOrCreate({
            where: {
              listId: reservation.listId,
              blockedDates: blockedDates,
              calendarStatus: 'blocked',
              reservationId
            }
          });
        }
      });

      if (blockedDatesFind.length == 0) {
        createdDates = await ListBlockedDates.findOrCreate({
          where: {
            listId: reservation.listId,
            blockedDates: blockedDates,
            calendarStatus: 'blocked',
            reservationId
          }
        });
      }

    });
  
  } else {
    throw new Error(`core.payment.blockDates.blockDates: The reservation or the listing time zone could not be determined for reservation id ${reservationId}.
      Reservation is ${JSON.stringify(reservation)},
      Listing is ${JSON.stringify(listing)}.`);
  }
}