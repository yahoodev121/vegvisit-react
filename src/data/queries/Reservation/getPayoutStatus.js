import TransactionHistoryType from '../../types/TransactionHistoryType';
import {TransactionHistory} from '../../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const getPayoutStatus = {

    type:  TransactionHistoryType,

    args: {
        reservationId: { type: new NonNull(IntType) }
    },

    async resolve({request}, {reservationId}) {
        if(request.user.admin) {

            return await TransactionHistory.findOne({
                where: {
                    reservationId
                } 
            });
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default getPayoutStatus; 