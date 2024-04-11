import ListViewsType from '../types/ListViewsType';
import { ListViews } from '../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';

import Sequelize from 'sequelize';

const UpdateListViews = {

  type: ListViewsType,

  args: {
    listId: { type: IntType },
  },

  async resolve({ request }, { listId }) {
    const Op = Sequelize.Op;
    if (request.user && request.user.admin != true) {
      const userId = request.user.id;
      const getViews = await ListViews.findAll({
        where: {
          listId,
          userId,
          createdAt: {
            [Op.lte]: new Date(),
            [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      const viewsCount = Object.keys(getViews).length;

      if (viewsCount === 0) {
        const createNewRecord = await ListViews.create({
          listId,
          userId,
        });
        return { status: 'success' };
      }
      return { status: '400' };
    }
    return { status: 'notLoggedIn' };
  },
};

export default UpdateListViews;
