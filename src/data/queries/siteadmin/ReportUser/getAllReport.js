import ReportUserType from '../../../types/ReportUserType';
import UserType from '../../../types/UserType';
import { ReportUser, User } from '../../../models';
import sequelize from '../../../sequelize';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';
import Sequelize from 'sequelize';

const getAllReport = {

    type: new List(ReportUserType),

    async resolve({ request }) {
        const Op = Sequelize.Op;
        return await ReportUser.findAll({
            order: [[`id`, `DESC`]],

            // using or
            // [Op.or]: [
            //     {
            //         userId: {
            //             [Op.in]: [
            //                 sequelize.literal("SELECT id FROM  User")
            //             ]
            //         }
            //     },
            //     {
            //         reporterId: {
            //             [Op.in]: [
            //                 sequelize.literal("SELECT id FROM  User")
            //             ]
            //         }
            //     }
            // ],

            // using where condition

            where: {
                userId: {
                    [Op.in]: [
                        sequelize.literal(`SELECT id FROM  User`)
                    ]
                },
                reporterId: {
                    [Op.in]: [
                        sequelize.literal(`SELECT id FROM  User`)
                    ]
                },
            }
            
        });
    }
};

export default getAllReport;

/**
query getAllReport{
  getAllReport{
    id
    reporterId
    userId
    reportType
  }
}

**/