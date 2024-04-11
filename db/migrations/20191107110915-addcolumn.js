'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('ListingData', 'securityDeposit', {
      type: Sequelize.FLOAT
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('ListingData', 'securityDeposit')
  }
};
