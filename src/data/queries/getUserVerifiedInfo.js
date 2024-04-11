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

const getUserVerifiedInfo = {

    type: UserVerifiedInfoType,

    args: {
        userId: { type: new NonNull(StringType) },
    },

    async resolve({request}, { userId }) {

        return await UserVerifiedInfo.findOne({
            where: {
                userId
            }
        });

    }
};

export default getUserVerifiedInfo;