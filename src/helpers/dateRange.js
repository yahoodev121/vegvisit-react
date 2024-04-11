import moment from 'moment';
import 'moment-timezone';

/**
 * Get days in range without the end day
 * @param {moment} startDate - The momentjs start date
 * @param {moment} stopDate - The momentjs end date
 */
export function getDates(startDate, stopDate) {
  const dateArray = [];
  const currentDate = startDate;
  while (currentDate < stopDate) {
    dateArray.push(currentDate.clone());
    currentDate.add(1, 'days');
  }
  return dateArray;
}

/**
 * Calculates date ranges from an array of single date objects
 *
 * @param {Array} dates - momentjs objects array
 */
export function getRange(dates) {
	var startDate = null, endDate = null, counter = 0;
	var previousDate = null, datesCollection = [];
	if (dates.length > 0) {
		if (dates.length === 1) {
			datesCollection = [
				{
					startDate: dates[0],
					endDate: dates[0].clone().add(1, 'days'),
				}
			]
		} else {
			dates.map((item) => {
				var dateRange = {};
				var currentDate = item;
				counter++;
				if (previousDate === null) {
					startDate = item;
				}
				if (previousDate != null) {
					var difference = currentDate.diff(previousDate, 'days');
					if (difference > 1) {
            endDate = previousDate.clone().add(1, 'days');
						dateRange = {
							startDate,
							endDate
						};
						datesCollection.push(dateRange);
						startDate = item;
						if (counter === dates.length) {
							endDate = item.clone().add(1, 'days');
							dateRange = {
								startDate,
								endDate
							};
							datesCollection.push(dateRange);
						}
					} else {
						if (counter === dates.length) {
							endDate = item.clone().add(1, 'days');
							dateRange = {
								startDate,
								endDate
							};
							datesCollection.push(dateRange);
						}
					}
				}
				previousDate = item;
			});
		}
	}
	return datesCollection;
}

/**
 * Get an array of blocked days from calendar data
 * @param {*} data - Parsed ical data
 * @param {string} timeZone - Time zone to be used for the blocked dates
 */
export function getBlockedDatesFromCalendar(data, timeZone) {
  const blockedDateCollection = [];
  for (var k in data) {
    if (data.hasOwnProperty(k)) {
      const ev = data[k];
      if (data[k].type === 'VEVENT' && ev.start) {
        const startDate = moment(ev.start).tz(timeZone, true).hour(12);
        let endDate;
        if (ev.end) {
          endDate = moment(ev.end).tz(timeZone, true).hour(12);
        } else {
          endDate = startDate.clone();
        }
        if (startDate.isSame(endDate)) {
          blockedDateCollection.push(startDate);
        } else {
          const range = getDates(startDate, endDate);
          range.map(async (item) => {
            blockedDateCollection.push(item);
          });
        }
      }
    }
  }
  return blockedDateCollection;
}
