import moment from 'moment';
import { Listing } from '../../src/data/models';
import { getTimezone } from '../../src/helpers/calculateDaysUntilCheckIn';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const listings = await Listing.findAll();
    const promises = listings.map(async (listing, index) => {
      const now = moment();
      const timeZoneId = await getTimezone(now, listing.lat, listing.lng);
      if (!timeZoneId) {
        // eslint-disable-next-line no-console
        console.log(`No timezone found for Listing ${listing.id} with Lat: ${listing.lat}, Lon: ${listing.lng}`, listing);
        return queryInterface.sequelize.query(`UPDATE Listing SET timeZone=null WHERE id=${listing.id};`);
      }
      return queryInterface.sequelize.query(`UPDATE Listing SET timeZone='${timeZoneId}' WHERE id=${listing.id};`);
    });
    return Promise.all(promises);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Listing` SET `timeZone`=null;"),
    ]);
  },
};
