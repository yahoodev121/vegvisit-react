'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Listing', 'services', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('Listing', 'moreDetails', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Listing', 'services'),
      queryInterface.removeColumn('Listing', 'moreDetails'),
    ])
  }
};
