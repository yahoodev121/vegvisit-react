import ReservationType from '../../types/ReservationType';
import {Reservation} from '../../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

import Sequelize from 'sequelize';

const getItinerary = {

    type:  ReservationType,

    args: {
        reservationId: { type: new NonNull(IntType) }
    },

    async resolve({request}, {reservationId}) {
        if(request.user) {
            const Op = Sequelize.Op;
            const id = reservationId;
            const userId = request.user.id;
            let where;
            
            if(request.user.admin){
              where = {
                id
              };
            } else {
              where = {
                id,
                [Op.or]: [
                        {
                            hostId: userId
                        },
                        {
                            guestId: userId
                        }
                    ]
              };
            }

            return await Reservation.findOne({
              where
            });
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default getItinerary;


/**

query getItinerary ($reservationId: Int!){
  getItinerary(reservationId: $reservationId){
    id
    listId
    hostId
    guestId
    checkIn
    checkOut
    listData {
      id
      title
      street
      city
      state
      country
      listingData {
        checkInStart
        checkInEnd
      }
      coverPhoto
      listPhotos {
        id
        name
      }
    }
    hostData {
      displayName
      picture
    }
  }
}

**/