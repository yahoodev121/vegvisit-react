// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType
} from 'graphql'

// GraphQL Type
import EditListingType from '../types/EditListingType'

// Sequelize models
import {
  Listing,
  UserServices,
  UserListingSteps,
  ListPhotos
} from '../../data/models'

import logger from '../../core/logger'

const updateListingStep2 = {
  type: EditListingType,

  args: {
    id: { type: IntType },
    title: { type: StringType },
    description: { type: StringType },
    kitchen: { type: StringType },
    nonVeg: { type: StringType },
    aboutPlaces: { type: StringType },
    aboutKitchen: { type: StringType },
    neighourhood: { type: StringType },
    notes: { type: StringType },
    services: { type: new List(StringType) },
    moreDetails: { type: StringType },
    coverPhoto: { type: IntType },
    photosSorting: { type: new List(IntType)}
  },

  async resolve (
    { request, response },
    {
      id,
      title,
      description,
      kitchen,
      nonVeg,
      aboutPlaces,
      aboutKitchen,
      neighourhood,
      notes,
      services,
      moreDetails,
      coverPhoto,
      photosSorting
    }
  ) {
    let isListUpdated = false

    if (request.user) {
      try {
        let where = { id }
        // If user is admin then don't set updatedAt of the listing
        let silent = true;
        if (!request.user.admin) {
          where = {
            id,
            userId: request.user.id
          };
          silent = false;
        }
  
        const updateInformation = {
          title,
          description,
          kitchen,
          nonVeg,
          aboutPlaces,
          aboutKitchen,
          neighourhood,
          notes,
          moreDetails,
          coverPhoto
        }
  
        logger.debug(
          `data.queries.updateListingStep2.updateListingStep2: Updating listing ${id} for user ${
            request.user.id
          } with following information: ${JSON.stringify(updateInformation)}`
        )
  
        const doUpdateListing = await Listing.update(updateInformation, {
          where,
          silent
        });

        // Check if any rows are affected, if just updating the photos sorting as admin then there is no updatedAt (silent mode) and nothing will be updated here
        if (doUpdateListing && doUpdateListing[0] !== undefined && (doUpdateListing[0] === 1 || (request.user.admin && doUpdateListing[0] === 0))) {
          logger.debug(
            `data.queries.updateListingStep2.updateListingStep2: Updated listing ${id} with following result: ${JSON.stringify(
              doUpdateListing
            )}`
          )
          isListUpdated = true
        } else {
          logger.error(
            `data.queries.updateListingStep2.updateListingStep2: Received following unexpected result when updating listing ${id}: ${JSON.stringify(
              doUpdateListing
            )}`
          )
        }
  
        // services
        if (isListUpdated && services != null && services != undefined) {
          logger.debug(
            `data.queries.updateListingStep2.updateListingStep2: Updating UserServices for listing ${id} now.`
          )
          const removeservices = await UserServices.destroy({
            where: {
              listId: id
            }
          })
          logger.debug(
            `data.queries.updateListingStep2.updateListingStep2: Removed UserServices for listing ${id} with following result: ${JSON.stringify(
              removeservices
            )}.`
          )
  
          services.map(async (item, key) => {
            let updateservices = await UserServices.create({
              listId: id,
              serviceId: item
            })
            logger.debug(
              `data.queries.updateListingStep2.updateListingStep2: Created entry in UserServices for listing ${id} and item ${item} with following result: ${JSON.stringify(
                updateservices
              )}`
            )
          })
        }

        if (isListUpdated && photosSorting && photosSorting.length > 0) {
          photosSorting.map(async (photoId, index) => {
            let updatePhotosSorting = await ListPhotos.update({sorting: index}, {
              where: {
                id: photoId
              }
            })
            logger.debug(
              `data.queries.updateListingStep2.updateListingStep2: Updated sorting of ListPhotos for photo ${photoId} with sorting value ${index} with following result: ${JSON.stringify(
                updatePhotosSorting
              )}`
            )
          })
        }
  
        if (isListUpdated) {
          logger.debug(
            `data.queries.updateListingStep2.updateListingStep2: Success for listing ${id}.`
          )
          return {
            status: 'success'
          }
        } else {
          logger.error(
            `data.queries.updateListingStep2.updateListingStep2: Listing not updated for listing ${id}!`
          )
          return {
            status: 'failed'
          }
        }
      } catch (error) {
        logger.error(
          `data.queries.updateListingStep2.updateListingStep2: An error occured during the update for listing ${id}!: ${error.message}`, error
        )
        return {
          status: 'failed'
        }
      }
    } else {
      logger.warn(
        `data.queries.updateListingStep2.updateListingStep2: Not logged in when trying to update Listing with id ${id}!`
      )
      return {
        status: 'notLoggedIn'
      }
    }
  }
}

export default updateListingStep2
