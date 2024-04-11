// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
} from 'graphql';
import Sequelize from 'sequelize';

import sequelize from '../../sequelize';
import ReservationType from '../../types/ReservationType';

// Sequelize models
import { Reviews, Reservation } from '../../models';

const writeReviewData = {

    type: ReservationType,

    args: {
        reservationId: { type: new NonNull(IntType) },
    },

    async resolve({ request, response }, { reservationId }) {
        if (request.user) {
            const Op = Sequelize.Op;
            const userId = request.user.id;
            return await Reservation.findOne({
                where: {
                    reservationState: 'completed',
                    [Op.or]: [
                        {
                            hostId: userId
                        },
                        {
                            guestId: userId
                        }
                    ],
                    [Op.and]: [
                        {
                            id: reservationId,
                        },
                        {
                            id: {
                                [Op.notIn]: [
                                    sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${userId}'`)
                                ]
                            }
                        }
                    ]
                },
            });
        } else {
            return {
                status: 'notLoggedIn'
            };
        }
    },
};

export default writeReviewData;

/**
query WriteReviewData($reservationdId: Int!){
  writeReviewData(reservationId: $reservationId){
    id
    listId
    hostData {
      userId
      profileId
      firstName
      lastName
      picture
      userData {
        email
      }
    }
    guestData {
      userId
      profileId
      firstName
      lastName
      picture
      userData {
        email
      }
    }
  }
}
**/