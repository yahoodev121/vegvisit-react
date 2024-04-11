'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('ListingData', 'additionalRules', {
        type: Sequelize.TEXT,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ListingData', 'additionalRules'),
    ])
  }
};
