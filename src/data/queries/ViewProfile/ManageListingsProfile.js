import ShowListingType from '../../types/ShowListingType';

import { Listing } from '../../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

const ManageListingsProfile = {

    type: new List(ShowListingType),

    args: {
        userId: { type: StringType },
    },
    
    async resolve({ request, response }, { userId }) {
        const limit = 12;
        return await Listing.findAll({
            where: {
                userId,
                isPublished: true
            },
            order: [[`createdAt`, `DESC`]],
            limit
        });
    }
};

export default ManageListingsProfile;