import HomeBannerType from '../types/HomeBannerType';
import { HomeBanner } from '../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLObjectType as ObjectType,
} from 'graphql';

const getHomeBanner = {

    type: new List(HomeBannerType),

    async resolve({ request }) {
        const data = await HomeBanner.findAll({});
        return data;

    }
};

export default getHomeBanner;
