var CronJob = require('cron').CronJob;
import Sequelize from 'sequelize';

import sequelize from '../../data/sequelize';
import { Reservation, ListBlockedDates, ThreadItems } from '../../data/models';
import fetch from '../fetch';
import { emailBroadcasts } from './paymentExpiredEmail';

const reservationExpireWihoutPayment = app => {

	new CronJob('0 0 * * * *', async function() {
	// new CronJob('0 */15 * * * *', async function () {
    const Op = Sequelize.Op;
		// get all reservation id
		const getReservationIds = await Reservation.findAll({
			attributes: ['id', 'paymentState', 'reservationState','hostId', 'checkIn', 'checkOut', 'guests', [sequelize.literal('TIMESTAMPDIFF(HOUR, updatedAt, NOW())'), 'hours_difference']],
			// attributes: ['id', 'paymentState', 'reservationState', 'hostId', 'checkIn', 'checkOut', 'guests', [sequelize.literal('TIMESTAMPDIFF(HOUR, checkOut, NOW())'), 'hours_difference']],
			having: {
				'hours_difference': {
					[Op.gt]: 24
				},
				paymentState: 'pending',
				reservationState: 'approved',
			}
		});

		// Store them in an array
		if (getReservationIds != null && getReservationIds.length > 0) {

      try {
        getReservationIds.map(async (item) => {

          // Update Reservation Status
          let updateReservation = await Reservation.update({
            paymentState: 'expired'
          }, {
            where: {
              id: item.id
            }
          });

          let getThreadId = await ThreadItems.findOne({
            where: {
              reservationId: item.id
            }
          });

          if (getThreadId) {
            let createThreadItems = await ThreadItems.create({
              threadId: getThreadId.threadId,
              sentBy: item.hostId,
              type: 'paymentExpire',
              startDate: item.checkIn,
              endDate: item.checkOut,
              personCapacity: item.guests,
              reservationId: item.id,
              messageType: getThreadId.messageType,
              content: ''
            });
          }

          // Unblock blocked dates
          let unblockDates = await ListBlockedDates.destroy({
            where: {
              reservationId: item.id
            }
          });

          await emailBroadcasts(item.id);
        });
      } catch (error) {
        logger.error('reservationExpireWihoutPayment: Error processing payment expiration: ' + error.message, error);
      }
		}

	}, null, true, 'America/Los_Angeles');

};

export default reservationExpireWihoutPayment;