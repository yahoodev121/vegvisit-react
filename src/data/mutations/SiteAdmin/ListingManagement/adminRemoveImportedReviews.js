import ResultType from '../../../types/ResultType';

import sequelize from '../../../../data/sequelize';
import { Reviews, Listing } from '../../../models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import logger from '../../../../core/logger';

const adminRemoveImportedReviews = {
  type: ResultType,

  args: {
    listId: { type: new NonNull(IntType) },
    url: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { listId, url }) {
    // Check whether admin is logged in
    if (request.user && request.user.admin) {
      try {
        const deletedReviewsCount = await sequelize.transaction(async (t) => {
          const listingUpdate = await Listing.update(
            {
              reviewsImportUrlAirbnb: null,
              lastReviewsImportAirbnb: null
            },
            {
              where: {
                id: listId,
                reviewsImportUrlAirbnb: url
              },
              transaction: t
            }
          );
          if (!(listingUpdate && listingUpdate.length === 1 && listingUpdate[0] === 1)) {
            throw new Error(`Listing was not updated correctly, result was ${JSON.stringify(listingUpdate)}`);
          }
          const removeImportedReviews = await Reviews.destroy({
            where: {
              listId: listId,
              importUrl: url,
            },
            transaction: t
          });
          return removeImportedReviews;
        });
        logger.info(
          `data.mutations.SiteAdmin.ListingManagement.adminRemoveImportedReviews.adminRemoveImportedReviews: Deleted ${deletedReviewsCount} imported reviews as User ${JSON.stringify(
            request.user
          )} for Listing ${listId} with URL ${url}.`
        );

        return {
          count: deletedReviewsCount,
          status: '200',
        };
      } catch (error) {
        logger.error(
          `data.mutations.SiteAdmin.ListingManagement.adminRemoveImportedReviews.adminRemoveImportedReviews: Error when trying to delete imported reviews as User ${JSON.stringify(
            request.user
          )} for Listing ${listId} with URL ${url}: ${error.message}`,
          error
        );
        return {
          status: '500',
        };
      }
    } else {
      logger.warn(
        `data.mutations.SiteAdmin.ListingManagement.adminRemoveImportedReviews.adminRemoveImportedReviews: Not authenticated as admimn but trying to delete imported reviews as User ${JSON.stringify(
          request.user
        )} for Listing ${listId} with URL ${url}.`
      );
      return {
        status: '403',
      };
    }
  },
};

export default adminRemoveImportedReviews;
