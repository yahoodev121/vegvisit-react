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

const pendingReviews = {

    type: new List(ReservationType),

    async resolve({ request, response }) {
        if(request.user) {
            const Op = Sequelize.Op;
            const userId = request.user.id;
            return await Reservation.findAll({
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
                    id: {
                        [Op.notIn]: [
                            sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${userId}'`)
                        ]
                    }
                },
            });
        } else {
            return {
                status: 'notLoggedIn'
            };
        }
    },
};

export default pendingReviews;

/**
query PendingReviews{
  pendingReviews{
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