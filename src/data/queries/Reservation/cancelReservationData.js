import ReservationType from '../../types/ReservationType';
import {Reservation} from '../../models';

import Sequelize from 'sequelize';
import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

const cancelReservationData = {

    type:  ReservationType,

    args: {
        reservationId: { type: new NonNull(IntType) },
        userType: { type: new NonNull(StringType) },
    },

    async resolve({request}, {reservationId, userType}) {
        const Op = Sequelize.Op;
        if(request.user) {
            const id = reservationId;
            const userId = request.user.id;           
            let where;
            let reservationState =  [ {reservationState: 'pending'}, {reservationState: 'approved'}];
            let checkOut = { [Op.gte]: new Date() };

            if(userType === 'host'){
                where = {
                    id,
                    hostId: userId,
                    [Op.or]: reservationState,
                    checkOut
                };
            } else {
                where = {
                    id,
                    guestId: userId,
                    [Op.or]: reservationState,
                    checkOut
                };
            }
            const result = await Reservation.findOne({
              where
            });
            return result;
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default cancelReservationData;
