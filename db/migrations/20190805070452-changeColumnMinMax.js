'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('ListingData', 'minNight', {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn('ListingData', 'maxNight', {
        type: Sequelize.STRING,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ListingData', 'minNight'),
      queryInterface.removeColumn('ListingData', 'maxNight'),
    ])
  }
};
