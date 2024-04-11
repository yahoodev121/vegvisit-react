import ReviewsType from '../../../types/ReviewsType';
import { Reviews } from '../../../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLObjectType as ObjectType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

const updateReview = {

    type: ReviewsType,

    args: {
        id: { type: IntType },
        type: { type: StringType },
    },

    async resolve({ request }, { id, type }) {

        let isAdminEnable = true ? type === 'enable' : false;

        if (request.user && request.user.admin == true) {

            const insertReviews = await Reviews.findOne({
                id
            });

            if (insertReviews) {
                const updateAdminReview = await Reviews.update(
                    {
                        isAdminEnable
                    },
                    {
                        where: {
                            id
                        }
                    }
                );
                return {
                    status: 'success'
                };
            } else {
                return {
                    status: 'failed'
                }
            }
        } else {
            return {
                status: 'not logged in'
            }
        }
    },
};

export default updateReview;
