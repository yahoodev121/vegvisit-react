import ReservationType from '../../types/ReservationType';
import {Reservation} from '../../models';

import Sequelize from 'sequelize';
import {
    GraphQLList as List,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

const getListReservation = {

    type:  ReservationType,

    args: {
        listId: { type: new NonNull(IntType) }
    },

    async resolve({request}, {listId}) {
        const Op = Sequelize.Op;
        if(request.user) {
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let tripFilter = {
                [Op.gte]: today
            };
            const count = await Reservation.count({
                where:{
                  listId,
                  checkIn: tripFilter 
                }
              });
              return {
                  status: '200',
                  count
              };
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default getListReservation;
