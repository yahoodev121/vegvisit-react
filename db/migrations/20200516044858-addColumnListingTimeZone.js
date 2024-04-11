'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Listing', 'timeZone', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'isMapTouched',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Listing', 'timeZone');
  }
};
