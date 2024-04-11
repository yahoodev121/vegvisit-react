'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `details` = 'Connect to Stripe and add your bank details (Only available in the U.S. and for USD payouts)' WHERE (`id` = '2');");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `details` = 'Connect to Stripe and add your bank details (Only available in the U.S.)' WHERE (`id` = '2');");
  }
};
