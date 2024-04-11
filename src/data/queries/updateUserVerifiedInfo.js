import UserVerifiedInfoType from '../types/UserVerifiedInfoType';
import {UserVerifiedInfo} from '../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const updateUserVerifiedInfo = {

    type: UserVerifiedInfoType,

    args: {
        item: { type: new NonNull(StringType) },
    },

    async resolve({request}, { item }) {

        if (request.user && request.user.admin != true) {

            if(item === "email"){
                await UserVerifiedInfo.update({
                    isEmailConfirmed: true
                },
                {
                    where: {
                        userId: request.user.id
                    }
                });

                return {
                    status: 'success'
                }
            }

            if(item === "facebook"){
                await UserVerifiedInfo.update({
                    isFacebookConnected: false
                },
                {
                    where: {
                        userId: request.user.id
                    }
                });

                return {
                    status: 'success'
                }
            }

            if(item === "google"){
                await UserVerifiedInfo.update({
                    isGoogleConnected: false
                },
                {
                    where: {
                        userId: request.user.id
                    }
                });

                return {
                    status: 'success'
                }
            }
        } else {
            return {status: 'notLoggedIn'}
        }
    }
};

export default updateUserVerifiedInfo;