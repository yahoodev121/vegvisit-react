'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Listing', 'aboutPlaces', {
        type: Sequelize.TEXT,
      }),
      queryInterface.changeColumn('Listing', 'aboutKitchen', {
        type: Sequelize.TEXT,
      }),
      queryInterface.changeColumn('Listing', 'neighourhood', {
        type: Sequelize.TEXT,
      }),
      queryInterface.changeColumn('Listing', 'notes', {
        type: Sequelize.TEXT,
      }),
      queryInterface.changeColumn('Listing', 'moreDetails', {
        type: Sequelize.TEXT,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Listing', 'aboutPlaces'),
      queryInterface.removeColumn('Listing', 'aboutKitchen'),
      queryInterface.removeColumn('Listing', 'neighourhood'),
      queryInterface.removeColumn('Listing', 'notes'),
      queryInterface.removeColumn('Listing', 'moreDetails'),
    ])
  }
};
