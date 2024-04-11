import ImageBannerType from '../types/ImageBannerType';
import {ImageBanner} from '../models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
} from 'graphql';

const getImageBanner = {

    type: ImageBannerType,

    async resolve({ request}) {
        return await ImageBanner.findOne();
    }
};

export default getImageBanner;
