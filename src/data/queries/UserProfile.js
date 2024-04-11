import Profile from '../types/ProfileType';
import { User, UserLogin, UserClaim, UserProfile } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const GetProfile = {

  type: new List(Profile),

  args: {
    profileId: { type: IntType },
  },

  async resolve({ request }, { profileId }) {

    // Get All User Profile Data
    const userData = await UserProfile.findAll({
      where: {
        profileId: profileId
      }
    });

    return userData;

  },
};

export default GetProfile;
