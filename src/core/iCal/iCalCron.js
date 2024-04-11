var CronJob = require('cron').CronJob;
var ical = require('ical');
var request = require('request');
import { blockDates, getCalendarData, removeBlockedDates } from './dbFunctions';
import { getBlockedDatesFromCalendar } from '../../helpers/dateRange';
import fetch from './../fetch';
import logger from '../logger';
import { Listing } from '../../data/models/index';

const iCalCron = app => {

	new CronJob('0 0 0 * * *', async function() {

        try {
          var calendarData = await getCalendarData();
          const toSearch = "text/calendar";
          calendarData.map((item) => {
              request({ url: item.url, headers: { accept: '*/*' } }, async function (error, response, body) {
                      if(!error) {
                          logger.debug(`core.iCal.iCalCron: Starting calendar synchronization for Listing ${item.listId} and ListCalendar item ${item.id}`);
                          const contentType = response.headers['content-type'];
  					              const dataIndex = contentType.search(toSearch);
                          if (dataIndex > -1) {
                              let listing;
                              if (item.listId) {
                                listing =  await Listing.findOne({
                                  where: { id: item.listId }
                                });
                              } else {
                                logger.warn(`core.iCal.iCalCron: No listId defined in ListCalendar item ${item.id}`);
                                return;
                              }
                              if (!(listing && listing.timeZone)) {
                                logger.warn(`core.iCal.iCalCron: No time zone found for Listing ${item.listId} in ListCalendar item ${item.id}`);
                                return;
                              }
                              // await removeBlockedDates(item.listId, item.id);
                              var data = ical.parseICS(body);
                              const blockedDates = getBlockedDatesFromCalendar(data, listing.timeZone);
                              const params = { 
                                  listId: item.listId, 
                                  calendarId: item.id, 
                                  blockedDates 
                              };
                              const query = `
                                  mutation IcalCronSync(
                                      $listId: Int!, 
                                      $calendarId: Int!, 
                                      $blockedDates: [String]
                                  ) {
                                      icalCronSync(
                                          listId: $listId, 
                                          calendarId: $calendarId, 
                                          blockedDates: $blockedDates
                                      ) {
                                          status
                                      }
                                  }
                              `;
                              const resp = await fetch('/graphql', {
                                  method: 'post',
                                  headers: {
                                      Accept: 'application/json',
                                      'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                      query: query,
                                      variables: params
                                  }),
                                  credentials: 'include'
                              });
                          } else {
                            logger.warn(`core.iCal.iCalCron: No ${toSearch} content-type found in ListCalendar id ${item.id} response from ${item.url}`);
                          }
                      } else {
                        logger.warn(`core.iCal.iCalCron: Error response from request to URL ${item.url} from ListCalendar id ${item.id} and Listing ${item.listId}`, error);
                      }
                  });
          });
        } catch (error) {
          logger.error('core.iCal.iCalCron error: ' + error.message, error);
        }

	}, null, true, 'America/Los_Angeles');

}; 

export default iCalCron;