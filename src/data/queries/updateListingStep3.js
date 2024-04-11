// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType
} from 'graphql'

import Sequelize from 'sequelize';

// GraphQL Type
import EditListingType from '../types/EditListingType'

// Sequelize models
import {
  Listing,
  UserListingSteps,
  UserHouseRules,
  ListingData,
  ListBlockedDates,
  ListPhotos,
  Currencies
} from '../../data/models'

import logger from '../../core/logger'

const updateListingStep3 = {
  type: EditListingType,

  args: {
    id: { type: IntType },
    houseRules: { type: new List(IntType) },
    bookingNoticeTime: { type: StringType },
    checkInStart: { type: StringType },
    checkInEnd: { type: StringType },
    maxDaysNotice: { type: StringType },
    minNight: { type: StringType },
    maxNight: { type: StringType },
    basePrice: { type: FloatType },
    securityDeposit: { type: FloatType },
    cleaningPrice: { type: FloatType },
    currency: { type: StringType },
    weeklyDiscount: { type: IntType },
    monthlyDiscount: { type: IntType },
    blockedDates: { type: new List(StringType) },
    bookingType: { type: new NonNull(StringType) },
    cancellationPolicy: { type: IntType },
    additionalRules: { type: StringType }
  },

  async resolve (
    { request, response },
    {
      id,
      houseRules,
      bookingNoticeTime,
      checkInStart,
      checkInEnd,
      maxDaysNotice,
      minNight,
      maxNight,
      basePrice,
      securityDeposit,
      cleaningPrice,
      currency,
      weeklyDiscount,
      monthlyDiscount,
      blockedDates,
      bookingType,
      cancellationPolicy,
      additionalRules
    }
  ) {
    const Op = Sequelize.Op;
    let isListUpdated = false

    // Check whether user is logged in
    if (request.user) {
      try {
        let where = { id }
        if (!request.user.admin) {
          where = {
            id,
            userId: request.user.id
          }
        }
  
        // Confirm whether the Listing Id is available
        const isListingAvailable = await Listing.findByPk(id)
  
        if (isListingAvailable != null) {
          // Currency
          let getCurrency = await Currencies.findOne({
            where: {
              isBaseCurrency: true
            }
          })
  
          let currencyValue = currency ? currency : getCurrency.symbol
  
          // Update Booking Type
          // if (bookingType) {
          //   const updateBookingType = await Listing.update({
          //     bookingType
          //   }, {
          //       where
          //     })
          // }
  
          // House Rules
          if (houseRules) {
            logger.debug(
              `data.queries.updateListingStep3.updateListingStep3: Updating UserHouseRules for listing ${id} now.`
            )
            const removeHouseRules = await UserHouseRules.destroy({
              where: {
                listId: id
              }
            })
            logger.debug(
              `data.queries.updateListingStep3.updateListingStep3: Removed UserHouseRules for listing ${id} with following result: ${JSON.stringify(
                removeHouseRules
              )}.`
            )
  
            if (houseRules.length > 0) {
              houseRules.map(async (item, key) => {
                let updateHouseRules = await UserHouseRules.create({
                  listId: id,
                  houseRulesId: item
                })
                logger.debug(
                  `data.queries.updateListingStep3.updateListingStep3: Created entry in UserHouseRules for listing ${id} and item ${item} with following result: ${JSON.stringify(
                    updateHouseRules
                  )}`
                )
              })
            }
          }
  
          // Blocked Dates
          if (blockedDates) {
            logger.debug(
              `data.queries.updateListingStep3.updateListingStep3: Updating ListBlockedDates for listing ${id} now.`
            )
            // Collect all records of Blocked Dates except Reservation Dates
            const blockedDatesData = await ListBlockedDates.findAll({
              where: {
                listId: id,
                reservationId: {
                  [Op.eq]: null
                },
                calendarId: {
                  [Op.ne]: null
                }
              }
            })
  
            // // Remove all the blocked dates except reservation dates
            // const removeBlockedDates = await ListBlockedDates.destroy({
            //   where: {
            //     listId: id,
            //     reservationId: {
            //       [Op.eq]: null
            //     }
            //   }
            // });
  
            //if(blockedDates.length > 0) {
            if (blockedDatesData && blockedDatesData.length > 0) {
              let blockedDatesItems = []
              blockedDatesData.map((item, key) => {
                blockedDatesItems[key] = new Date(item.blockedDates)
              })
              blockedDates.map(async (item, key) => {
                let day = new Date(item)
                let blockedItem = blockedDatesItems.map(Number).indexOf(+day)
                if (blockedItem > -1) {
                  /*let createRecord = await ListBlockedDates.create({
                    listId: id,
                    blockedDates: item,
                    calendarId: blockedDatesData[blockedItem].calendarId
                  });*/
                  let createRecord = await ListBlockedDates.findOrCreate({
                    where: {
                      listId: id,
                      blockedDates: item,
                      calendarId: blockedDatesData[blockedItem].calendarId
                    },
                    defaults: {
                      //properties you want on create
                      listId: id,
                      blockedDates: item,
                      calendarId: blockedDatesData[blockedItem].calendarId
                    }
                  })
                  logger.debug(
                    `data.queries.updateListingStep3.updateListingStep3: Find or create (existing) entry in ListBlockedDates for listing ${id}, item ${item} and calendarId ${blockedDatesData[blockedItem].calendarId} with following result: ${JSON.stringify(
                      createRecord
                    )}`
                  )
                } else {
                  /*let createRecord = await ListBlockedDates.create({
                    listId: id,
                    blockedDates: item,
                  });*/
                  let createRecord = await ListBlockedDates.findOrCreate({
                    where: {
                      listId: id,
                      blockedDates: item
                    },
                    defaults: {
                      //properties you want on create
                      listId: id,
                      blockedDates: item
                    }
                  })
                  logger.debug(
                    `data.queries.updateListingStep3.updateListingStep3: Find or create entry in ListBlockedDates (no previous calendar data blocked dates) for listing ${id} and item ${item} with following result: ${JSON.stringify(
                      createRecord
                    )}`
                  )
                }
              })
            } else {
              blockedDates.map(async (item, key) => {
                let updateBlockedDates = await ListBlockedDates.findOrCreate({
                  where: {
                    listId: id,
                    blockedDates: item
                  },
                  defaults: {
                    //properties you want on create
                    listId: id,
                    blockedDates: item
                  }
                })
                logger.debug(
                  `data.queries.updateListingStep3.updateListingStep3: Find or create entry in ListBlockedDates for listing ${id} and item ${item} with following result: ${JSON.stringify(
                    updateBlockedDates
                  )}`
                )
              })
            }
            //}
          }
  
          logger.debug(
            `data.queries.updateListingStep3.updateListingStep3: Updating ListingData for listing ${id} now.`
          )
          // Check if record already available for this listing
          const isListingIdAvailable = await ListingData.findOne({
            where: { listId: id }
          })
  
          if (isListingIdAvailable != null) {
            // Update Record
            const updateData = ListingData.update(
              {
                bookingNoticeTime: bookingNoticeTime,
                checkInStart: checkInStart,
                checkInEnd: checkInEnd,
                maxDaysNotice: maxDaysNotice,
                minNight: minNight,
                maxNight: maxNight,
                basePrice: basePrice,
                securityDeposit: securityDeposit,
                cleaningPrice: cleaningPrice,
                currency: currencyValue,
                weeklyDiscount,
                monthlyDiscount,
                cancellationPolicy,
                additionalRules
              },
              {
                where: {
                  listId: id
                }
              }
            )
            isListUpdated = true
            logger.debug(
              `data.queries.updateListingStep3.updateListingStep3: Updated ListingData for listing ${id} with following result: ${JSON.stringify(
                updateData
              )}`
            )
          } else {
            // Create New Record
            const createData = ListingData.create({
              listId: id,
              bookingNoticeTime: bookingNoticeTime,
              checkInStart: checkInStart,
              checkInEnd: checkInEnd,
              maxDaysNotice: maxDaysNotice,
              minNight: minNight,
              maxNight: maxNight,
              basePrice: basePrice,
              securityDeposit: securityDeposit,
              cleaningPrice: cleaningPrice,
              currency: currencyValue,
              weeklyDiscount: weeklyDiscount,
              monthlyDiscount: monthlyDiscount,
              cancellationPolicy,
              additionalRules
            })
  
            logger.debug(
              `data.queries.updateListingStep3.updateListingStep3: Created ListingData for listing ${id} with following result: ${JSON.stringify(
                createData
              )}`
            )
  
            if (createData) {
              isListUpdated = true
            }
          }
  
          if (isListUpdated) {
            const photosCount = await ListPhotos.count({ where: { listId: id } })
            if (photosCount > 0) {
              const updateListingStatus = await Listing.update(
                {
                  isReady: true
                },
                {
                  where: { id }
                }
              )
              logger.debug(
                `data.queries.updateListingStep3.updateListingStep3: Updated Listing status as isReady for listing ${id} with following result: ${JSON.stringify(
                  updateListingStatus
                )}`
              )
            }
            logger.debug(
              `data.queries.updateListingStep3.updateListingStep3: Success for listing ${id}.`
            )
            return {
              status: 'success'
            }
          } else {
            logger.error(
              `data.queries.updateListingStep3.updateListingStep3: No ListingData updated or created for listing ${id}!`
            )
            return {
              status: 'failed'
            }
          }
        } else {
          logger.warn(
            `data.queries.updateListingStep3.updateListingStep3: No Listing found with id ${id}!`
          )
          return {
            status: 'notAvailable'
          }
        }
      } catch (error) {
        logger.error(
          `data.queries.updateListingStep3.updateListingStep3: An error occured during the update for listing ${id}!: ${error.message}`, error
        )
        return {
          status: 'failed'
        }
      }
    } else {
      logger.warn(
        `data.queries.updateListingStep3.updateListingStep3: Not logged in when trying to update Listing with id ${id}!`
      )
      return {
        status: 'notLoggedIn'
      }
    }
  }
}

export default updateListingStep3
