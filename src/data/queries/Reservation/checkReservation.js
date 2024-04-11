import ReservationType from '../../types/ReservationType';
import { checkAvailableDates } from '../../../core/reservation/checkAvailableDates';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';
import logger from '../../../core/logger';

const checkReservation = {

    // type:  new List(ReservationType),
    type: ReservationType,

    args: {
        checkIn: { type: new NonNull(StringType) },
        checkOut: { type: new NonNull(StringType) },
        listId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { checkIn, checkOut, listId }) {
        if (request.user) {
            try {
                const checkResult = await checkAvailableDates(listId, checkIn, checkOut);
                logger.debug(`data.queries.Reservation.checkReservation.checkReservation: Checked dates (from ${checkIn} to ${checkOut}) for listing ${listId} and user ${JSON.stringify(request.user)} with result ${JSON.stringify(checkResult)}`);
                return checkResult;
            } catch (error) {
                logger.error(`data.queries.Reservation.checkReservation.checkReservation: Internal server error checking available dates (from ${checkIn} to ${checkOut}) for listing ${listId} and user ${JSON.stringify(request.user)} with message: ${error.message}`, error);
                throw new Error('Internal server error checking available dates');
            }
        } else {
            return {
                status: "notLoggedIn",
            };
        }
    }
};

export default checkReservation;