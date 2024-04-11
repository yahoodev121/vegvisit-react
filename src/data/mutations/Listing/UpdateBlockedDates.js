import ListBlockedDatesType from '../../types/ListBlockedDatesType';
import { ListBlockedDates } from '../../models';
import logger from '../../../core/logger';

import moment from 'moment';
import sequelize from 'sequelize';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
} from 'graphql';

const UpdateBlockedDates = {

    type: ListBlockedDatesType,

    args: {
        listId: { type: new NonNull(IntType) },
        blockedDates: { type: new List(StringType) },
        calendarStatus: { type: StringType },
        isSpecialPrice: { type: FloatType }
    },

    async resolve({ request }, { listId, blockedDates, calendarStatus, isSpecialPrice }) {

        // Check whether user is logged in
        if (request.user) {
            try {
              var blockedDatesCollection = [];
              var reservationDatesCollection = [];

              // isSpevialPrice cannot be undefined in where clause
              if (isSpecialPrice === undefined) {
                isSpecialPrice = null;
              }
              // Blocked Dates
              if (blockedDates) {
                  // Collect all records of Blocked Dates except Reservation Dates
  
                  let day;
                  let itemValue;
                  const updateResult = await Promise.all(blockedDates.map(async (item, key) => {
                      
                      day = moment.utc(item).format('YYYY-MM-DD');
                      let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);
                      let blockedDatesFind = await ListBlockedDates.findAll({
                          //attributes: ['id', 'blockedDates'],
                          where: {
                              blockedDates: dayList,
                              listId: listId
                          }
                      });

                      let singleUpdateResult;
  
                      if (blockedDatesFind && blockedDatesFind.length > 0) {
  
                        singleUpdateResult = await Promise.all(blockedDatesFind.map(async (value, keys) => {
  
                              let blockedDate = moment.utc(value.blockedDates).format('YYYY-MM-DD');     
                              let blockedDayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), blockedDate);
                              const updateDates = await ListBlockedDates.update({
                                  // listId,
                                  // blockedDates: value.blockedDates,
                                  isSpecialPrice: isSpecialPrice,
                                  calendarStatus: calendarStatus,
                              },
                                  {
                                      where: {
                                          listId,
                                          blockedDates: blockedDayList,
                                          reservationId: null
                                      }
                                  });
                          }));
  
                      } else {
  
                        singleUpdateResult = await ListBlockedDates.findOrCreate({
                              where: {
                                  listId,
                                  blockedDates: dayList,
                                  calendarStatus: calendarStatus,
                                  isSpecialPrice: isSpecialPrice,
                              },
                              defaults: {
                                  //properties you want on create
                                  listId,
                                  blockedDates: item,
                                  calendarStatus: calendarStatus,
                                  isSpecialPrice: isSpecialPrice,
                              }
                          });
                      }

                      return singleUpdateResult;
  
                  }));

                  logger.info(`data.mutations.Listing.UpdateBlockedDates.UpdateBlockedDates: Blocked dates for listing ${listId} with values ${JSON.stringify({blockedDates, calendarStatus, isSpecialPrice})}. Results were: ${JSON.stringify(updateResult)}.`);

                  return {
                      status: '200'
                  };
  
              } else {
                  logger.warn(`data.mutations.Listing.UpdateBlockedDates.UpdateBlockedDates: No blocked dates specified when trying to block dates for listing ${listId} with values ${JSON.stringify({blockedDates, calendarStatus, isSpecialPrice})}. Request was: ${JSON.stringify(request)}.`);
                  return {
                      status: '400'
                  };
              }
            } catch (error) {
              logger.error(`data.mutations.Listing.UpdateBlockedDates.UpdateBlockedDates: Error when updating blocked dates for listing ${listId} with values ${JSON.stringify({blockedDates, calendarStatus, isSpecialPrice})}: ${error.message}.`, error);
            }
        } else {
          logger.warn(`data.mutations.Listing.UpdateBlockedDates.UpdateBlockedDates: Unauthenticated attempt to block dates for listing ${listId} with values ${JSON.stringify({blockedDates, calendarStatus, isSpecialPrice})}. Request was: ${JSON.stringify(request)}.`);
          return {
            status: '401'
          }
        }
    }
};

export default UpdateBlockedDates;


/**
mutation($listId: Int!, $blockedDates: [String]) {
    UpdateBlockedDates(listId: $listId, blockedDates: $blockedDates) {
        status
    }
}
 */
