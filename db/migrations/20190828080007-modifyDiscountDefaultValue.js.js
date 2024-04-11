'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("ALTER TABLE ListingData CHANGE COLUMN weeklyDiscount weeklyDiscount FLOAT;"),
      queryInterface.sequelize.query("ALTER TABLE ListingData CHANGE COLUMN monthlyDiscount monthlyDiscount FLOAT;"),

    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
     
    ])
  }
};
