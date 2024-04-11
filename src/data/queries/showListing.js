import ShowListingType from '../types/ShowListingType';
import { Listing, UserAmenities, UserSafetyAmenities, UserSpaces } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const showListing = {

  type: ShowListingType,

  args: {
    listId: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { listId }) {

    // Get All Listing Data
    const listingData = await Listing.findOne({
      where: {
        id: listId
      },
    });

    return listingData;

  },
};

export default showListing;
