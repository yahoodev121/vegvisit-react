import ShowListingStepsType from '../types/ShowListingStepsType';
import { UserListingSteps } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const showListingSteps = {

  type: ShowListingStepsType,

  args: {
    listId: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { listId }) {

    // Get All Listing Data
    const listingSteps = await UserListingSteps.findOne({
      attributes: [
        'id',
        'listId',
        'step1',
        'step2',
        'step3'
      ],
      where: {
        listId: listId
      }
    });

    return listingSteps;

  },
};

export default showListingSteps;
