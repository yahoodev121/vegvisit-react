import ListingDashboardType from '../../types/siteadmin/ListingDashboardType';
import { Listing, UserListingSteps, ListPhotos } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

const getListingDashboard = {

  type: ListingDashboardType,

  async resolve({ request }) {

    const Op = Sequelize.Op;

    const include = [
        {
          model: UserListingSteps, 
          attributes: ['id'],
          as: "userListingSteps",
          where: {
            step3: "completed"
          },
        },
        {
          model: ListPhotos, 
          attributes: ['id'],
          as: "listPhotos",
          required: true
        }
      ];

    const totalCountQuery = await Listing.findAll({
      attributes: ['id'],
      // include
    });

    const totalCount = Object.keys(totalCountQuery).length;

    const todayCountQuery = await Listing.findAll({
      attributes: ['id'],
       where: { 
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      },
      include,
    });

    const todayCount = Object.keys(todayCountQuery).length;

    const monthCountQuery = await Listing.findAll({
      attributes: ['id'],
      where: { 
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      include
    });

    const monthCount = Object.keys(monthCountQuery).length;


    return {
      totalCount,
      todayCount,
      monthCount
    };
    
  },
};

export default getListingDashboard;
