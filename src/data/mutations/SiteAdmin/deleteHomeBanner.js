// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

import HomeBannerType from '../../types/HomeBannerType';
import { HomeBanner } from '../../../data/models';


const deleteHomeBanner = {

    type: HomeBannerType,

    args: {
        id: { type: new NonNull(IntType) }
    },

    async resolve({ request, response }, {
        id
    }) {
        if (request.user.admin) {
            const HomeBannerDetails = await HomeBanner.findByPk(id);
            const HomeBannerDetailsCount = await HomeBanner.count(id);

            if (!HomeBannerDetails) {
                return {
                    status: '404'
                }
            }

            let deleteHomeBannerimage;

            if (HomeBannerDetailsCount == 1) {
                return {
                    status: '400'
                }
            } else {
                deleteHomeBannerimage = await HomeBanner.destroy({
                    where: {
                        id: id
                    }
                });
            }

            if (deleteHomeBannerimage) {
                return {
                    status: '200'
                }
            } else {
                return {
                    status: '400'
                }
            }

        } else {
            return {
                status: 'notLoggedIn'
            }
        }
    }
}

export default deleteHomeBanner;