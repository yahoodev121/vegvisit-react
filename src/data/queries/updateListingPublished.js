// GrpahQL
import { GraphQLInt as IntType } from 'graphql';

// GraphQL Type
import EditListingType from '../types/EditListingType';

// Sequelize models
import { Listing } from '../../data/models';

import logger from '../../core/logger';

const updateListingPublished = {
  type: EditListingType,

  args: {
    listId: { type: IntType },
    isPublished: { type: IntType },
  },

  async resolve (
    { request, response },
    {
      listId,
      isPublished,
    }
  ) {
    let isListUpdated = false

    if (request.user) {
      try {
        let where = { id: listId }
        if (!request.user.admin) {
          where = {
            id: listId,
            userId: request.user.id
          }
        }

        const updateInformation = {
          isPublished
        }

        const doUpdateListing = await Listing.update(updateInformation, {
          where
        });
        if (doUpdateListing && doUpdateListing[0] && doUpdateListing[0] === 1) {
          logger.debug(
            `data.queries.updateListing.updateListing: Updated listing ${listId} with following result: ${JSON.stringify(
              doUpdateListing
            )}`
          )
          isListUpdated = true;
        } else {
          logger.error(
            `data.queries.updateListing.updateListing: Received following unexpected result when updating listing ${listId}: ${JSON.stringify(
              doUpdateListing
            )}`
          )
        }

        if (isListUpdated) {
          logger.debug(
            `data.queries.updateListing.updateListing: Success for listing ${listId}.`
          )
          return {
            status: 'success'
          }
        } else {
          logger.error(
            `data.queries.updateListing.updateListing: Listing not updated for listing ${listId}!`
          )
          return {
            status: 'failed'
          }
        }
      } catch (error) {
        logger.error(
          `data.queries.updateListing.updateListing: An error occured during the update for listing ${listId}!: ${error.message}`, error
        )
        return {
          status: 'failed'
        }
      }
    } else {
      logger.warn(
        `data.queries.updateListing.updateListing: Not logged in when trying to update Listing with id ${listId}!`
      )
      return {
        status: 'notLoggedIn'
      }
    }
  }
}

export default updateListingPublished
