import UserDashboardType from '../../types/siteadmin/UserDashboardType';
import { User } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import Sequelize from 'sequelize';

const getUserDashboard = {

  type: UserDashboardType,

  async resolve({ request }) {

    const Op = Sequelize.Op;

    const totalCount = await User.count({
      where: { 
       userDeletedAt: null
     },
   });

    const todayCount = await User.count({
       where: { 
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
        },
        userDeletedAt: null
      },
    });

    const monthCount = await User.count({
       where: { 
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        },
        userDeletedAt: null
      },
    });

    return {
      totalCount,
      todayCount,
      monthCount
    };
    
  },
};

export default getUserDashboard;
