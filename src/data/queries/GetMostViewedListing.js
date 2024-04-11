import ShowListingType from '../types/ShowListingType';
import {ListViews, Listing, UserListingSteps, ListPhotos} from '../../data/models';
import sequelize from '../sequelize';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const GetMostViewedListing = {

    type: new List(ShowListingType),

    async resolve({ request }) {

        return await Listing.findAll({
            where: {
                isPublished: true
            },
            include: [
                { 
                    model: ListViews,
                    attributes: [],
                    as: 'listViews',
                    required: true,
                    duplicating: false
                }
            ],
            order: [
                [sequelize.fn('count', sequelize.col('listViews.listId')), 'DESC'],
            ],
            group: ['listViews.listId'],
            limit: 10,
            offset: 0
        });

    }
};

export default GetMostViewedListing;