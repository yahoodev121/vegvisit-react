import AllReservationType from '../../types/AllReservationType';
import {Reservation} from '../../models';

import Sequelize from 'sequelize';
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const getAllReservation = {

    type:  AllReservationType,

    args: {
        userType: { type: StringType },
        currentPage: { type: IntType },
        dateFilter: { type: StringType }
    },

    async resolve({request}, {userType, currentPage, dateFilter}) {
        const Op = Sequelize.Op;
        const limit = 5;
        let offset = 0;
        // Offset from Current Page
        if(currentPage){
          offset = (currentPage - 1) * limit;
        }
        if(request.user && !request.user.admin) {
            const userId = request.user.id;
            let where;
            let paymentState = 'completed';
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let tripFilter = {
                [Op.gte]: today
            };

            if (dateFilter == 'previous') {
                tripFilter = {
                    [Op.lt]: today
                }
            }

            if(userType === 'host'){
                where = {
                    hostId: userId,
                    // paymentState,
                    checkOut: tripFilter,
                    isValid: true
                };
            } else {
                where = {
                    guestId: userId,
                    // paymentState,
                    checkOut: tripFilter,
                    isValid: true
                };
            }

            const count = await Reservation.count({ where });
            const reservationData = await Reservation.findAll({
              where,
              order: [['checkIn', 'ASC']],
              limit: limit,
              offset: offset, 
            }); 

            return {
              reservationData,
              count,
              currentPage
            };
            
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default getAllReservation;

/**

query getAllReservation ($userType: String){
  getAllReservation(userType: $userType){
    id
    listId
    checkIn
    checkOut
    guestServiceFee
    hostServiceFee
    reservationState
        total
    message {
      id
    }
    listData {
      id
      title
      street
      city
      state
      country
    }
    hostData {
      profileId
      displayName
      picture
    }
    guestData {
      profileId
      displayName
      picture
    }
  }
}

**/
