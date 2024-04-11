import ReportUserWholeType from '../../types/siteadmin/ReportUserWholeType';
// For sequelize functions
import sequelize from '../../sequelize';
import { ReportUser, Listing, Reviews } from '../../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';
import moment from 'moment';
import Sequelize from 'sequelize';

const reportUserManagement = {
    type: ReportUserWholeType,
    args: {
        currentPage: { type: IntType },
        searchList: { type: StringType },
    },
    async resolve({ request, response }, { currentPage, searchList }) {
        const Op = Sequelize.Op;
        if (request.user && request.user.admin == true) {
            const limit = 10;
            let offset = 0;
            // Offset from Current Page
            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }

            let reportsData, userCountLength, where;
            if (searchList) {
                let getDate = moment(searchList).format('YYYY-MM-DD');
                where = {
                    [Op.or]: [
                        {
                            id: {
                                [Op.or]: [
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM ReportUser WHERE reporterId IN(SELECT userId FROM UserProfile WHERE displayName LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM ReportUser WHERE reporterId IN(SELECT id FROM User WHERE email LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM ReportUser WHERE userId IN(SELECT userId FROM UserProfile WHERE displayName LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM ReportUser WHERE userId IN(SELECT id FROM User WHERE email LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM ReportUser WHERE reportType LIKE '%${searchList}%'`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM ReportUser WHERE createdAt LIKE '%${getDate}%'`
                                            )]
                                    },

                                ]
                            },

                        }
                    ],
                }
                userCountLength = await ReportUser.count({
                    where
                });
                reportsData = await ReportUser.findAll({
                    where,
                    order: [['updatedAt', 'DESC']],
                    limit,
                    offset,
                });
            } else {
                userCountLength = await ReportUser.count({});
                // Get All User Profile Data
                reportsData = await ReportUser.findAll({
                    limit,
                    offset,
                    order: [
                        ['updatedAt', 'DESC']
                    ],
                });
            }
            return {
                reportsData,
                count: userCountLength
            };
        }
    },
};
export default reportUserManagement;
