import EditUserType from '../../types/siteadmin/EditUserType';
import { User, UserLogin, UserClaim, UserProfile } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const editUser = {

  type: EditUserType,

  args: {
    profileId: { type: new NonNull(IntType) },
  },

  async resolve({ request }, { profileId }) {

    // Get All User Profile Data
    const userData = await UserProfile.findOne({
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
        'info',
        'createdAt'
      ],
      where: {
        profileId: profileId
      }
    });

    return userData;

  },
};

export default editUser;
