import BannerType from '../types/BannerType';
import {Banner} from '../../data/models';

import {GraphQLList as List} from 'graphql';

const getBanner = {

    type: BannerType,

    async resolve({request}) {
        return await Banner.findOne();
    }
};

export default getBanner;