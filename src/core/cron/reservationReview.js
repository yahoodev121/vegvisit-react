var CronJob = require('cron').CronJob;
import Sequelize from 'sequelize';

import sequelize from '../../data/sequelize';
import { Reservation, ThreadItems } from '../../data/models';
import { emailBroadcast } from './completedEmail';

const reservationReview = app => {

	new CronJob('0 0 16 * * *', async function () {
    const Op = Sequelize.Op;
		// get all reservation id
		const getReservationIds = await Reservation.findAll({
			attributes: ['id', 'reservationState', 'hostId', 'checkIn', 'checkOut', [sequelize.literal('TIMESTAMPDIFF(DAY, checkOut, NOW())'), 'day_difference']],
			having: {
				'day_difference': {
					[Op.eq]: 1
				},
				reservationState: 'completed',
			}
		});

		// Update Reservation Status to completed
		if (getReservationIds != null && getReservationIds.length > 0) {
			getReservationIds.map(async (item) => {
				// Get ThreadId
				let getThreadId = await ThreadItems.findOne({
					where: {
						reservationId: item.id
					}
				});

				await emailBroadcast(item.id);
			})
		}

		// }, null, true, 'America/Los_Angeles');

	}, null, true, 'America/Cuiaba');

};

export default reservationReview;