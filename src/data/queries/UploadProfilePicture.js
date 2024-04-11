import UserEditProfile from '../types/userEditProfileType';
import {UserProfile} from '../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const UploadProfilePicture = {

    type: UserEditProfile,

    args: {
        picture: {
            type: new NonNull(StringType)
        }
    },

    async resolve({request}, {picture}) {

        if (request.user && request.user.admin != true) {
           await UserProfile.update({
                picture
            }, {
                where: {
                    userId: request.user.id
                }
            });

            return {status: 'success'}
        } else {
            return {status: 'notLoggedIn'}
        }
    }
};

export default UploadProfilePicture;