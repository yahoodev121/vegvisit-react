var CronJob = require('cron').CronJob;
import Sequelize from 'sequelize';

import sequelize from '../../data/sequelize';
import { Reservation, ThreadItems } from '../../data/models';
import { emailBroadcast } from './completedEmail';

const reservationComplete = app => {
	new CronJob('0 0 0 * * *', async function() {
	// new CronJob('0 * * * * *', async function () {
		// get all reservation id
		const Op = Sequelize.Op;
		const getReservationIds = await Reservation.findAll({
			attributes: ['id', 'reservationState', 'paymentState', 'hostId', 'checkIn', 'checkOut', 'guests', [sequelize.literal('TIMESTAMPDIFF(DAY, checkOut, NOW())'), 'day_difference']],
			having: {
				'day_difference': {
					[Op.gte]: 0
				},
        reservationState: 'approved',
        paymentState: 'completed',
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

				// Create new ThreaItem for completion
				if (getThreadId) {
					let createThreadItem = await ThreadItems.create({
						threadId: getThreadId.threadId,
						sentBy: item.hostId,
						type: 'completed',
						startDate: item.checkIn,
						endDate: item.checkOut,
						personCapacity: item.guests,
						reservationId: item.id,
						messageType: getThreadId.messageType
					});
				}

				// Update Reservation Status
				let updateReservation = await Reservation.update({
					reservationState: 'completed'
				}, {
						where: {
							id: item.id
						}
					});

				// Update ThreadItems
	    		// let updateThreadItems = await ThreadItems.update({
	    		// 	type: 'completed'
	    		// }, {
	    		// 	where: {
	    		// 		reservationId: item.id
	    		// 	}
	    		// });

				// await emailBroadcast(item.id);
			})
		}

	}, null, true, 'America/Los_Angeles');

};

export default reservationComplete;