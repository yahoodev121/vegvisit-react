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
  UserAmenities,
  UserSafetyAmenities,
  UserSpaces,
  UserListingSteps,
  UserListingData,
  BedTypes
} from '../../data/models'

import logger from '../../core/logger'

const updateListing = {
  type: EditListingType,

  args: {
    id: { type: IntType },
    roomType: { type: StringType },
    houseType: { type: StringType },
    residenceType: { type: StringType },
    bedrooms: { type: StringType },
    buildingSize: { type: StringType },
    bedType: { type: StringType },
    beds: { type: IntType },
    personCapacity: { type: IntType },
    bathrooms: { type: FloatType },
    bathroomType: { type: StringType },
    country: { type: StringType },
    street: { type: StringType },
    buildingName: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    isMapTouched: { type: BooleanType },
    timeZone: { type: StringType },
    amenities: { type: new List(IntType) },
    safetyAmenities: { type: new List(IntType) },
    spaces: { type: new List(IntType) },
    bedTypes: { type: StringType }
  },

  async resolve (
    { request, response },
    {
      id,
      roomType,
      houseType,
      residenceType,
      bedrooms,
      buildingSize,
      bedType,
      beds,
      personCapacity,
      bathrooms,
      bathroomType,
      country,
      street,
      buildingName,
      city,
      state,
      zipcode,
      lat,
      lng,
      isMapTouched,
      timeZone,
      amenities,
      safetyAmenities,
      spaces,
      bedTypes
    }
  ) {
    let isListUpdated = false

    if (request.user) {
      try {
        let where = { id }
        if (!request.user.admin) {
          where = {
            id,
            userId: request.user.id
          }
        }
  
        const updateInformation = {
          residenceType: residenceType,
          bedrooms: bedrooms,
          bedType: bedType,
          beds: beds,
          personCapacity: personCapacity,
          bathrooms: bathrooms,
          country: country,
          street: street,
          buildingName: buildingName,
          city: city,
          state: state,
          zipcode: zipcode,
          lat: lat,
          lng: lng,
          isMapTouched: isMapTouched,
          timeZone: timeZone
        }
  
        logger.debug(
          `data.queries.updateListing.updateListing: Updating listing ${id} for user ${
            request.user.id
          } with following information: ${JSON.stringify(updateInformation)}`
        )
  
        const doUpdateListing = await Listing.update(updateInformation, {
          where
        });
        if (doUpdateListing && doUpdateListing[0] && doUpdateListing[0] === 1) {
          logger.debug(
            `data.queries.updateListing.updateListing: Updated listing ${id} with following result: ${JSON.stringify(
              doUpdateListing
            )}`
          )
          isListUpdated = true;
        } else {
          logger.error(
            `data.queries.updateListing.updateListing: Received following unexpected result when updating listing ${id}: ${JSON.stringify(
              doUpdateListing
            )}`
          )
        }
  
        // User Settings Data
        if (isListUpdated) {
          logger.debug(
            `data.queries.updateListing.updateListing: Updating related data for listing ${id} now.`
          )
          const removeUserSettingsData = await UserListingData.destroy({
            where: {
              listId: id
            }
          })
          logger.debug(
            `data.queries.updateListing.updateListing: Removed UserListingData for listing ${id} with following result: ${JSON.stringify(
              removeUserSettingsData
            )}.`
          )
  
          let otherListSettings = []
          if (roomType)
            otherListSettings.push({ settingsId: roomType, listId: id })
          if (houseType)
            otherListSettings.push({ settingsId: houseType, listId: id })
          if (buildingSize)
            otherListSettings.push({ settingsId: buildingSize, listId: id })
          if (bedType) otherListSettings.push({ settingsId: bedType, listId: id })
          if (bathroomType)
            otherListSettings.push({ settingsId: bathroomType, listId: id })
          if (otherListSettings.length > 0) {
            logger.debug(
              `data.queries.updateListing.updateListing: Processing other settings (UserListingData) for listing with id ${id}: ${JSON.stringify(
                otherListSettings
              )}`
            )
            // Bulk create on UserListingData to store other settings of this listingSteps
            const createOtherSettings = await UserListingData.bulkCreate(
              otherListSettings
            ).catch(error => {
              logger.error(
                `data.queries.updateListing.updateListing: Error processing other settings (UserListingData) for listing with id ${id}: ${error.message}`,
                error
              )
            })
            logger.debug(
              `data.queries.updateListing.updateListing: Processed other settings (UserListingData) for listing with id ${id} with result: ${JSON.stringify(
                createOtherSettings
              )}`
            )
          } else {
            logger.debug(
              `data.queries.updateListing.updateListing: No other settings (UserListingData) to process for listing with id ${id}: ${JSON.stringify(
                otherListSettings
              )}`
            )
          }
  
          // Amenities
          if (amenities != null && amenities != undefined) {
            logger.debug(
              `data.queries.updateListing.updateListing: Updating UserAmenities for listing ${id}.`
            )
            const removeAmenities = await UserAmenities.destroy({
              where: {
                listId: id
              }
            })
            logger.debug(
              `data.queries.updateListing.updateListing: Removed UserAmenities for listing ${id} with following result: ${JSON.stringify(
                removeAmenities
              )}.`
            )
  
            amenities.map(async (item, key) => {
              let updateAmenities = await UserAmenities.create({
                listId: id,
                amenitiesId: item
              })
              logger.debug(
                `data.queries.updateListing.updateListing: Created entry in UserAmenities for listing ${id} and item ${item} with following result: ${JSON.stringify(
                  updateAmenities
                )}`
              )
            })
          }
  
          // Safety Amenities
          if (safetyAmenities != null && safetyAmenities != undefined) {
            logger.debug(
              `data.queries.updateListing.updateListing: Updating UserSafetyAmenities for listing ${id}.`
            )
            const removeSafetyAmenities = await UserSafetyAmenities.destroy({
              where: {
                listId: id
              }
            })
            logger.debug(
              `data.queries.updateListing.updateListing: Removed UserSafetyAmenities for listing ${id} with following result: ${JSON.stringify(
                removeSafetyAmenities
              )}.`
            )
  
            safetyAmenities.map(async (item, key) => {
              let updateSafetyAmenities = await UserSafetyAmenities.create({
                listId: id,
                safetyAmenitiesId: item
              })
              logger.debug(
                `data.queries.updateListing.updateListing: Created entry in UserSafetyAmenities for listing ${id} and item ${item} with following result: ${JSON.stringify(
                  updateSafetyAmenities
                )}`
              )
            })
          }
  
          // Spaces
          if (spaces != null && spaces != undefined) {
            logger.debug(
              `data.queries.updateListing.updateListing: Updating UserSpaces for listing ${id}.`
            )
            const removeSpaces = await UserSpaces.destroy({
              where: {
                listId: id
              }
            })
            logger.debug(
              `data.queries.updateListing.updateListing: Removed UserSpaces for listing ${id} with following result: ${JSON.stringify(
                removeSpaces
              )}.`
            )
  
            spaces.map(async (item, key) => {
              let updateUserSpaces = await UserSpaces.create({
                listId: id,
                spacesId: item
              })
              logger.debug(
                `data.queries.updateListing.updateListing: Created entry in UserSpaces for listing ${id} and item ${item} with following result: ${JSON.stringify(
                  updateUserSpaces
                )}`
              )
            })
          }
  
          let bedTypeData
          if (bedTypes && bedTypes.length > 0) {
            logger.debug(
              `data.queries.updateListing.updateListing: Updating BedTypes for listing ${id}.`
            )
            bedTypeData = JSON.parse(bedTypes)
  
            // items included
            if (bedTypeData != null && bedTypeData != undefined) {
              const removeBedTypes = await BedTypes.destroy({
                where: {
                  listId: id
                }
              })
              logger.debug(
                `data.queries.updateListing.updateListing: Removed BedTypes for listing ${id} with following result: ${JSON.stringify(
                  removeBedTypes
                )}.`
              )
  
              await Promise.all(
                bedTypeData.map(async (item, key) => {
                  let updateBedTypes = await BedTypes.create({
                    listId: id,
                    bedCount: item.bedCount,
                    bedType: item.bedType
                  })
                  logger.debug(
                    `data.queries.updateListing.updateListing: Created entry in BedTypes for listing ${id} and item ${item} with following result: ${JSON.stringify(
                      updateBedTypes
                    )}`
                  )
                })
              )
            }
          }
        }
  
        if (isListUpdated) {
          logger.debug(
            `data.queries.updateListing.updateListing: Success for listing ${id}.`
          )
          return {
            status: 'success'
          }
        } else {
          logger.error(
            `data.queries.updateListing.updateListing: Listing not updated for listing ${id}!`
          )
          return {
            status: 'failed'
          }
        }
      } catch (error) {
        logger.error(
          `data.queries.updateListing.updateListing: An error occured during the update for listing ${id}!: ${error.message}`, error
        )
        return {
          status: 'failed'
        }
      }
    } else {
      logger.warn(
        `data.queries.updateListing.updateListing: Not logged in when trying to update Listing with id ${id}!`
      )
      return {
        status: 'notLoggedIn'
      }
    }
  }
}

export default updateListing
