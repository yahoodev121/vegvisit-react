
//moment
import moment from 'moment';
import 'moment-timezone';

import Sequelize from 'sequelize';

import { Listing, ListBlockedDates } from '../../../data/models';

import logger from '../../logger';

export async function isListExist(listId, secret) {
	return await Listing.findOne({
		where: {
			id: listId,
      isPublished: 1,
      calendarExportSecret: secret
		}
	});
}

export async function getBlockedDates(listId) {
  const Op = Sequelize.Op;
  const listing = await Listing.findOne({
    where: {
      id: listId
    }
  });
  if (!(listing && listing.timeZone)) {
    logger.warn(`core.iCal.exportIcal.dbFunctions.getBlockedDates: No time zone found for Listing ${listId}`);
    return [];
  }
	const blockedDates = await ListBlockedDates.findAll({
		where: {
			listId,
			calendarId: {
          [Op.eq]: null
			},
			calendarStatus: {
                [Op.notIn]: ['available']
            }
		},
        order: [
            ['blockedDates', 'ASC']
        ]
	});
    var dates = [];
    blockedDates.map((item) => {
      dates.push(moment(item.blockedDates).tz(listing.timeZone));
      // dates.push(moment(item.blockedDates).tz(listing.timeZone).format('YYYY-MM-DD'));
		  // dates.push(moment.utc(item.blockedDates).format('YYYY-MM-DD'));
	});
    return dates;
}