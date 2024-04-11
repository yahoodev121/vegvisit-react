import MessageManagementWholeType from '../../types/siteadmin/MessageManagementWholeType';
import ThreadsType from '../../types/ThreadsType';
// For sequelize functions
import sequelize from '../../sequelize';
import { User, UserLogin, UserClaim, UserProfile, Threads, Listing } from '../../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';
import moment from 'moment';
import Sequelize from 'sequelize';

const messageManagement = {
    type: MessageManagementWholeType,
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
            let usersData, userCountLength, where;
            if (searchList) {
                // let getDate = moment(searchList).format('YYYY-MM-DD');
                where = {
                    [Op.or]: [
                        {
                            id: {
                                [Op.or]: [
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM Threads WHERE listId IN(SELECT id FROM Listing WHERE title LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM Threads WHERE host IN(SELECT userId FROM UserProfile WHERE displayName LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM Threads WHERE guest IN(SELECT userId FROM UserProfile WHERE displayName LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM Threads WHERE host IN(SELECT id FROM User WHERE email LIKE '%${searchList}%')`
                                            )]
                                    },
                                    {
                                        [Op.in]: [
                                            sequelize.literal(
                                                `SELECT id FROM Threads WHERE guest IN(SELECT id FROM User WHERE email LIKE '%${searchList}%')`
                                            )]
                                    },
                                ]
                            },

                        }
                    ],
                }
                userCountLength = await Threads.count({
                    where
                });
                usersData = await Threads.findAll({
                    where,
                    order: [['createdAt', 'ASC']],
                    limit,
                    offset,
                });
            } else {
                userCountLength = await Threads.count({});
                // Get All User Profile Data
                usersData = await Threads.findAll({
                    limit,
                    offset,
                    order: [
                        ['messageUpdatedDate', 'DESC']
                    ],
                });
            }
            return {
                usersData,
                count: userCountLength
            };
        }
    },
};
export default messageManagement;
