import UserManagementWholeDataType from '../../types/siteadmin/UserManagementWholeDataType';
// For sequelize functions
import sequelize from '../../sequelize';
import { User, UserLogin, UserClaim, UserProfile } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import moment from 'moment';
import Sequelize from 'sequelize';

const userManagement = {
  type: UserManagementWholeDataType,
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
        let getDate = moment(searchList).format('YYYY-MM-DD');
        where = {
          [Op.or]: [
            {
              id: {
                [Op.or]: [{
                  [Op.in]: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                        UserProfile
                                      WHERE firstName like '%${searchList}%'
                                      `)]
                },
                {
                  [Op.in]: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                      UserProfile
                                      WHERE lastName like '%${searchList}%'
                                      `)]
                },
                {
                  [Op.in]: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                      UserProfile
                                      WHERE phoneNumber like '%${searchList}%'
`)]
                },
                {
                  [Op.in]: [
                    sequelize.literal(`
                                      SELECT
                                      userId
                                      FROM
                                      UserProfile
                                      WHERE createdAt like '%${getDate}%'
`)]
                },
                {
                  [Op.in]: [
                    sequelize.literal(`
                                      SELECT
                                      id
                                      FROM
                                      User
                                      WHERE email like '%${searchList}%'
`)]
                },
                ]
              },
              
            }
          ],
          userDeletedAt: null
        }
        userCountLength = await User.count({
          where
        });
        usersData = await User.findAll({
          attributes: ['id', 'email', 'userBanStatus', 'lastLogin'],
          profile: {
            attributes: [
              'profileId',
              'firstName',
              'lastName',
              'dateOfBirth',
              'gender',
              'phoneNumber',
              'preferredLanguage',
              'preferredCurrency',
              'location',
              'info'
            ]
          },
          where,
          order: [['createdAt', 'ASC']],
          limit,
          offset,
          include: [
            { model: UserProfile, as: 'profile' },
          ]
        });
      } else {
        userCountLength = await User.count({ where: { userDeletedAt: null } });
        // Get All User Profile Data
        usersData = await User.findAll({
          attributes: ['id', 'email', 'userBanStatus', 'lastLogin'],
          profile: {
            attributes: [
              'profileId',
              'firstName',
              'lastName',
              'dateOfBirth',
              'gender',
              'phoneNumber',
              'preferredLanguage',
              'preferredCurrency',
              'location',
              'info'
            ]
          },
          where: {
            userDeletedAt: null
          },
          order: [['createdAt', 'ASC']],
          limit,
          offset,
          include: [
            { model: UserProfile, as: 'profile' },
          ]
        });
      }
      return {
        usersData,
        count: userCountLength
      };
    }
  },
};
export default userManagement;
