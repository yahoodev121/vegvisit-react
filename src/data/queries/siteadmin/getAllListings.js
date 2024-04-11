// Query Type
import GetAllListingType from '../../types/siteadmin/GetAllListingType';

// For sequelize functions
import sequelize from '../../sequelize';
import moment from 'moment';

// Database models
import { Listing, UserProfile, User } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLInputObjectType as InputObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

import Sequelize from 'sequelize';

const getAllListings = {
  type: GetAllListingType,
  args: {
    currentPage: { type: IntType },
    searchList: { type: StringType },
    sortColumn: { type: StringType },
    sortDirection: { type: IntType }
  },

  async resolve({ request }, args) {
    const currentPage = args.currentPage;
    const searchList = args.searchList;
    const sortColumn = args.sortColumn || 'id';
    const sortDirection = args.sortDirection === -1 ? 'DESC' : 'ASC';
    const Op = Sequelize.Op;
    if (request.user && request.user.admin == true) {
      const limit = 10;
      let offset = 0;
      // Offset from Current Page
      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }
      let getListings, listCountLength, where;
      if (searchList) {
        let getDate = moment(searchList).format('YYYY-MM-DD');
        where = {
          [Op.or]: [
            {
              title: {
                [Op.like]: '%' + searchList + '%'
              }
            },
            {
              city: {
                [Op.like]: '%' + searchList + '%'
              }
            },
            {
              state: {
                [Op.like]: '%' + searchList + '%'
              }
            },
            {
              country: {
                [Op.like]: '%' + searchList + '%'
              }
            },
            {
              street: {
                [Op.like]: '%' + searchList + '%'
              }
            },
            {
              buildingName: {
                [Op.like]: '%' + searchList + '%'
              }
            },
            {
              createdAt: {
                [Op.in]: [
                  sequelize.literal(`
                  SELECT
                  createdAt
                  FROM
                      Listing
                  WHERE createdAt like '%${getDate}%'
                `)
                ]
              }
            },
            {
              userId: {
                [Op.in]: [
                  sequelize.literal(`
                  SELECT
                      userId
                  FROM
                      UserProfile
                  WHERE firstName like '%${searchList}%'
                `)
                ]
              }
            },
            {
              userId: {
                [Op.in]: [
                  sequelize.literal(`
                  SELECT
                      id
                  FROM
                      User
                  WHERE email like '%${searchList}%'
                `)
                ]
              }
            }
          ]
        }
        listCountLength = await Listing.count({
          where
        });
        getListings = await Listing.findAll({
          limit,
          offset,
          order: [[sortColumn, sortDirection]],
          where
          /*where: {
            isPublished: true
          }*/
        });
      } else {
        listCountLength = await Listing.count();
        getListings = await Listing.findAll({
          limit,
          offset,
          order: [[sortColumn, sortDirection]],
          /*where: {
            isPublished: true
          }*/
        });
      }

      return {
        usersData: getListings,
        count: listCountLength
      };
    } else {
      return {
        status: 'failed'
      }
    }
  },
};

export default getAllListings;