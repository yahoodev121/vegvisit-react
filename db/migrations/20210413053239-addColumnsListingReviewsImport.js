'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Listing', 'reviewsImportUrlAirbnb', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Listing', 'lastReviewsImportAirbnb', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Listing', 'reviewsImportUrlAirbnb'),
      queryInterface.removeColumn('Listing', 'lastReviewsImportAirbnb'),
    ]);
  }
};
