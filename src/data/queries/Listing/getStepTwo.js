import ShowListingType from '../../types/ShowListingType';
import { 
  Listing, 
  UserAmenities, 
  UserSafetyAmenities, 
  UserSpaces, 
  ListSettings, 
  ListSettingsTypes, 
  UserListingData,
  ListBlockedDates } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const getStepTwo = {

  type: ShowListingType,

  args: {
    listId: { type: new NonNull(StringType) }
  },

  async resolve({ request }, { listId }) {
    let where;
    if (request.user) {
      if (!request.user.admin) {
        const userId = request.user.id;
        where = {
          id: listId,
          userId
        };
      } else {
        where = {
          id: listId
        };
      }
    } else {
      where = {
        id: listId
      };
    }

    const listingData = await Listing.findOne({
      where
    });

    return listingData;

  },
};

export default getStepTwo;
