// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType,
} from 'graphql';

// GraphQL Type
import RetreatMealType from '../types/RetreatMealType';

// Sequelize models
import { HasRetreatMeals } from '../models';

import fetch from '../../core/fetch/fetch.server';

import logger from '../../core/logger';
import isValidNumber from '../../helpers/isValidNumber';

const createRetreatMeal = {

  type: RetreatMealType,

  args: {
    listingRetreatId: { type: IntType },
    mealId: { type: [IntType] }
  },

  async resolve({ request, response }, {
    listingRetreatId,
    mealId
  }) {

    if (request.user && request.user.admin != true) {
      const retreatMeals = await HasRetreatMeals.bulkCreate(mealId.map(each => ({
        listingRetreatId,
        mealId: each
      })));
      return {
        status: "success",
        retreatMeals
      };
    } else {
      logger.debug(`data.queries.createListing.createListing: Returning "notLoggedIn"`);
      return {
        status: "notLoggedIn",
      };
    }

  },
};

export default createListing;
