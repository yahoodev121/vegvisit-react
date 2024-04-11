// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

import ReviewsType from '../../../types/ReviewsType';

// Sequelize models
import { Reviews } from '../../../models';

const deleteAdminReview = {

    type: ReviewsType,

    args: {
        reviewId: { type: new NonNull(IntType) }
    },

    async resolve({ request, response }, {
        reviewId
    }) {
        if (request.user.admin) {
            const reviewDetails = await Reviews.findByPk(reviewId);
            if (!reviewDetails) {
                return {
                    status: '404'
                }
            }

            const deleteReview = await Reviews.destroy({
                where: {
                    id: reviewId
                }
            });

            if (deleteReview) {
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

export default deleteAdminReview;