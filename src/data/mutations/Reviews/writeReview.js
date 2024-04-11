// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

import ReviewsType from '../../types/ReviewsType';

// Sequelize models
import { Reviews } from '../../models';

import logger from '../../../core/logger';

const writeReview = {

    type: ReviewsType,

    args: {
        reservationId: { type: new NonNull(IntType) },
        listId: { type: new NonNull(IntType) },
        receiverId: { type: new NonNull(StringType) },
        reviewContent: { type: new NonNull(StringType) },
        rating: { type: new NonNull(FloatType) },
        automated: { type: BooleanType },
        userStatus: { type: new NonNull(StringType) }
    },

    async resolve({ request, response }, {
        reservationId,
        listId,
        receiverId,
        reviewContent,
        rating,
        automated,
        userStatus
    }) {
        // Check if user already logged in
        if (request.user && !request.user.admin) {

            try {
              const userId = request.user.id;
              let parentId = 0;
  
              const isOtherUserReview = await Reviews.findOne({
                  where: {
                      reservationId,
                      userId,
                      isAdminEnable: true
                  }
              });
  
              if (isOtherUserReview) {
                  parentId = isOtherUserReview.id;
              }
  
              const [review, created] = await Reviews.findOrCreate({
                  where: {
                      reservationId,
                      authorId: userId,
                      isAdminEnable: true
                  },
                  defaults: {
                      //properties you want on create
                      reservationId,
                      listId,
                      authorId: userId,
                      userId: receiverId,
                      reviewContent,
                      rating,
                      parentId,
                      automated,
                      userStatus: userStatus
                  }
              })
  
              if (created) {
                  logger.info(`data.mutations.Reviews.writeReview.writeReview: A new review was created with following result: ${JSON.stringify(review)}`);
                  return {
                      status: '200'
                  }
              } else {
                  logger.warn(`data.mutations.Reviews.writeReview.writeReview: An existing review was found when trying to create it: ${JSON.stringify(review)}`);
                  return {
                      status: '400'
                  }
              }
            } catch (error) {
              logger.error(`data.mutations.Reviews.writeReview.writeReview: Error when trying to create a review: ${error.message}`, error);
              return {
                status: '500'
              }
            }

        } else {
            return {
                status: "notLoggedIn",
            };
        }
    },
};

export default writeReview;

/**
mutation writeReview(
    $reservationId: Int!,
    $listId: Int!,
    $receiverId: String!,
    $reviewContent: String!,
    $rating: Float!,
){
    writeReview(
        reservationId: $reservationId,
        listId: $listId,
        receiverId: $receiverId,
        reviewContent: $reviewContent,
        rating: $rating,
    ) {
        status
    }
}
**/
