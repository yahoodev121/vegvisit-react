import ReservationDashboardType from '../../types/siteadmin/ReservationDashboardType';
import { Reservation } from '../../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

const getReservationDashboard = {

    type: ReservationDashboardType,

    async resolve({ request }) {

        const Op = Sequelize.Op;

        const totalCount = await Reservation.count({
            where:{
                paymentState:'completed'
            },
        });

        const todayCount = await Reservation.count({
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                },
                paymentState: 'completed'

            },
        });

        const monthCount = await Reservation.count({
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                },
                paymentState: 'completed'

            },
        });

        return {
            totalCount,
            todayCount,
            monthCount
        };

    },
};

export default getReservationDashboard;
