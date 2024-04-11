import AllReservationType from '../../types/AllReservationType';
import { Reservation, TransactionHistory } from '../../models';
import sequelize from '../../sequelize';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';
import Sequelize from 'sequelize';

const getTransactionHistory = {

    type: AllReservationType,

    args: {
        mode: { type: StringType },
        payoutId: { type: IntType },
        listId: { type: IntType },
        currentPage: { type: IntType },
    },

    async resolve({ request }, { mode, payoutId, listId, currentPage }) {
        const limit = 5;
        let offset = 0;
        // Offset from Current Page
        if (currentPage) {
            offset = (currentPage - 1) * limit;
        }
        if (request.user && !request.user.admin) {
            const Op = Sequelize.Op;
            const userId = request.user.id;
            let include, reservationRule, transactionRule;
            reservationRule = {
                hostId: userId,
                paymentState: 'completed',
            };
            let id = {
                [Op.notIn]: [
                    sequelize.literal("SELECT reservationId FROM TransactionHistory")
                ]
            };

            if (listId && listId > 0) {
                reservationRule = {
                    hostId: userId,
                    paymentState: 'completed',
                    listId,
                };
            }

            if (payoutId && payoutId > 0) {
                transactionRule = {
                    payoutId
                }
            }

            if (mode === 'completed'  || mode === 'grossEarnings') {
                include = [
                    {
                        model: TransactionHistory,
                        as: 'transactionHistory',
                        required: true,
                        where: transactionRule
                    }
                ];
                let reservationStates = [
                    {
                        reservationState: 'completed'
                    },
                    {
                        reservationState: 'cancelled'
                    }
                ];
                reservationRule = Object.assign({}, reservationRule, { [Op.or]: reservationStates });
            } else {
                let reservationStates = [
                    {
                        reservationState: 'approved'
                    },
                    {
                        reservationState: 'completed'
                    },
                    {
                        reservationState: 'cancelled'
                    }
                ];

                reservationRule = Object.assign({}, reservationRule, { id }, { [Op.or]: reservationStates });
            }

            const count = await Reservation.findAll({
                where: reservationRule,
                include,
                order: [['checkIn', 'DESC']],
                // limit: limit,
                // offset: offset,
            });

            const reservationData = await Reservation.findAll({
                where: reservationRule,
                include,
                order: [['checkIn', 'DESC']],
                limit: limit,
                offset: offset,
            });

            return {
                reservationData,
                count: count.length
            }

        } else {
            return {
                status: 'notLoggedIn',
            };
        }
    }
};

export default getTransactionHistory;

/**
query getTransactionHistory ($mode: String, $payoutId: Int, $listId: Int){
  getTransactionHistory(mode: $mode, payoutId: $payoutId, listId: $listId){
    id
    listId
    checkIn
    checkOut
    guestServiceFee
    hostServiceFee
    reservationState
    total
    listData {
      id
      title
      street
      city
      state
      country
    }
    hostTransaction {
      id
      amount
      currency
    }
    hostPayout {
      id
      payEmail
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