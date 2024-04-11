var ical = require('ical-generator');
import {url, sitename} from '../../../config';
var cal = ical({ domain: url, name: sitename });
import { getRange } from '../../../helpers/dateRange';
import { isListExist, getBlockedDates } from './dbFunctions';
import logger from '../../logger';

const exportICalRoutes = app => {

    app.get('/export-calendar', async function (req, res) {
        const listId = req.query['id'];
        const secret = req.query['s'];
        if (!listId) {
          logger.debug(`/export-calendar: No listing id specified.`);
          res.sendStatus(400);
          return;
        }
        if (!secret) {
          logger.debug(`/export-calendar: No secret specified, Listing: ${listId}`);
          res.sendStatus(400);
          return;
        }
        logger.debug(`/export-calendar: Starting calendar export for Listing ${listId}.`);
        var datesCollection = [];
        const listData = await isListExist(listId, secret);
        if(listData && listData.calendarExportSecret) {
            const dates = await getBlockedDates(listId);
            if(dates && dates.length > 0) {
                datesCollection = getRange(dates);
                cal.clear();
                datesCollection.map((item) => {
                    logger.debug(`/export-calendar: Creating calendar event for Listing ${listId}. Start: ${item.startDate.format()}, End: ${item.endDate.format()}`);
                    cal.createEvent({
                        start: item.startDate,
                        end: item.endDate,
                        // floating: true,
                        allDay: true,
                        summary: sitename + ' - ' + listData.title,
                        description: listData.title,
                        location: listData.city,
                        url: url + '/rooms/' + listData.id
                    });
                });
            } else {
                cal.clear();
            }
        } else {
            logger.warn(`/export-calendar: No listing found with id ${listId} and secret ${secret}.`);
            cal.clear();
            res.sendStatus(404);
            return;
        }
        cal.serve(res);
    })
};

export default exportICalRoutes;