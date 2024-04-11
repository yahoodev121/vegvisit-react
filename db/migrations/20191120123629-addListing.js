'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Listing', 'listingStatus', {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Listing', 'listingStatus'),
    ])
  }
};
