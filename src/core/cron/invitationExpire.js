var CronJob = require('cron').CronJob;
import Sequelize from 'sequelize';

import sequelize from '../../data/sequelize';
import { ThreadItems } from '../../data/models';
import { emailBroadcast } from './invitationExpiredEmail';

const invitationExpire = app => {

	new CronJob('0 0 * * * *', async function () {
    const Op = Sequelize.Op;
		// get all reservation id
		const getThreadItemsIds = await ThreadItems.findAll({
			attributes: [
				'id',
        'type',
        'messageType',
        'reservationId',
				[
					sequelize.literal('TIMESTAMPDIFF(HOUR, updatedAt, NOW())'),
          'hours_difference'
        ]
			],
			having: {
        type: 'preApproved',
        messageType: 'inquiry',
        reservationId: {
          [Op.eq]: null
        },
        'hours_difference': {
					[Op.gt]: 24
				},
			}
		});

		// Store them in an array
		if (getThreadItemsIds != null && getThreadItemsIds.length > 0) {
			getThreadItemsIds.map(async (item) => {

				// Update ThreadItems type
				let updateThreadItems = await ThreadItems.update({
					type: 'expired'
				}, {
					where: {
						id: item.id
					}
        });
        
        await emailBroadcast(item.id);

			})
		}

	}, null, true, 'America/Los_Angeles');

};

export default invitationExpire;