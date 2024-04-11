import RequestBookingListType from '../../types/RequestBookingListType';
import { RequestBookingList } from '../../models';
import sequelize from '../../sequelize';
import moment from 'moment';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const checkRequestBooking = {

    type: RequestBookingListType,

    args: {
        checkIn: { type: StringType },
        checkOut: { type: StringType },
        listId: { type: IntType },
        hostId: { type: StringType },
        guestId: { type: StringType }
    },

    async resolve({ request }, { checkIn, checkOut, listId, hostId, guestId }) {
        if (request.user) {
            let checkInday = moment(checkIn).utc().format('YYYY-MM-DD');
            let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('checkInStart')), checkInday);
            let checkInEndday = moment(checkOut).utc().format('YYYY-MM-DD');
            let dayList1 = sequelize.where(sequelize.fn('DATE', sequelize.col('checkInEnd')), checkInEndday);
            const checkAvailableDates = await RequestBookingList.findAll({
                where: {
                    listId,
                    host: hostId,
                    guest: guestId,
                    checkInStart: dayList,
                    checkInEnd: dayList1
                }
            });

            if (checkAvailableDates && checkAvailableDates.length > 0) {
                return {
                    status: "200",
                    count: checkAvailableDates.length
                };
            }
            else {
                return {
                    status: "200",
                    count: 0
                };
            }
        } else {
            return {
                status: "notLoggedIn",
                count: 0
            };
        }
    }
};

export default checkRequestBooking;