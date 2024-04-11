import ReservationType from '../../types/ReservationType';
import { Reservation } from '../../models';

import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

const getReservation = {

    type: ReservationType,

    args: {
        reservationId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { reservationId }) {
        if (request.user) {

            let getResevation = await Reservation.findOne({
                where: {
                    id: reservationId
                }
            });

            return getResevation;

        } else {
            return {
                status: "notLoggedIn",
            };
        }
    }
};

export default getReservation; 