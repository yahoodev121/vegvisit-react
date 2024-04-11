var ical = require('ical');
var request = require('request');
import { findURL, storeCalendar } from './dbFunctions';
import { getBlockedDatesFromCalendar } from '../../helpers/dateRange';
import { Listing } from '../../data/models/index';
import logger from '../logger';

const iCalRoutes = app => {

	app.post('/import-calendar', async function (req, res) {

		if (!req.user) {
			res.redirect('/');
    } else {

      try {
        if (!(req.body && req.body.data && req.body.data.listId && req.body.data.url && req.body.data.name)) {
          logger.warn(`/import-calendar: Mandatory post request parameters missing: ${JSON.stringify(req.body)}`);
          res.send({ status: 400 });
          return;
        }
        logger.debug(`/import-calendar: Called with following data: ${JSON.stringify(req.body.data)}`);
  			const listId = req.body.data.listId;
  			const url = req.body.data.url;
  			const name = req.body.data.name;
  			const calendarId = req.body.data.calendarId;
  			const toSearch = "text/calendar";
  			const toSearchHtml = "text/html";
  
  
  			if (!calendarId) {
  				const isURLAvailable = await findURL(url, listId);
  				if (isURLAvailable) {
  					res.send({ status: 409 });
  					return;
  				}
  			}
  
  			request({ url, headers: { accept: '*/*' } }, async function (error, response, body) {
  				if (error) {
  					res.send({ status: 400 });
  					return;
  				}
  
  				if (response && response.statusCode === 200) {
  					var contentType = response.headers['content-type'];
  					var dataIndex = contentType.search(toSearch);
  					var dataIndexHtml = contentType.search(toSearchHtml);
  
  					if (dataIndex > -1 || dataIndexHtml > -1) {
              const listing = await Listing.findOne({
                where: { id: listId }
              });
              if (!(listing && listing.timeZone)) {
                logger.warn(`/import-calendar: No time zone found for Listing ${listId}`);
                res.send({ status: 500 });
                return;
              }
  						var calendarData, calendarDataId;
  						if (!calendarId) {
  							calendarData = await storeCalendar(url, listId, name);
  							calendarDataId = calendarData.id;
  						} else {
  							calendarDataId = calendarId;
  						}
  						var data = ical.parseICS(body);
  						var blockedDateCollection = getBlockedDatesFromCalendar(data, listing.timeZone);
  						res.send({ status: 200, blockedDates: blockedDateCollection, calendarDataId });
  
  					} else {
  						res.send({ status: 400 });
  						return;
  					}
  
  				} else {
  					res.send({ status: 400 });
  					return;
  				}
        });
      } catch (error) {
        logger.error('/import-calendar error: ' + error.message, error);
        res.send({ status: 500 });
        return;
      }
      
		}
	})
};

export default iCalRoutes;

