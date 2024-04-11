'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Listing', 'kitchen', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('Listing', 'nonVeg', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('Listing', 'aboutPlaces', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('Listing', 'aboutKitchen', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('Listing', 'neighourhood', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('Listing', 'notes', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Listing', 'kitchen'),
      queryInterface.removeColumn('Listing', 'nonVeg'),
      queryInterface.removeColumn('Listing', 'aboutPlaces'),
      queryInterface.removeColumn('Listing', 'aboutKitchen'),
      queryInterface.removeColumn('Listing', 'neighourhood'),
      queryInterface.removeColumn('Listing', 'notes'),
    ])
  }
};
