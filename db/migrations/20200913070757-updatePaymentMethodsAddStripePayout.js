'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isPayoutMethod` = '1', `name` = 'Stripe (Bank Account)', `details` = 'Connect to Stripe and add your bank details (Only available in the U.S.)' WHERE (`id` = '2');");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isPayoutMethod` = '0', `name` = 'Bank Account', `details` = 'Add your bank details' WHERE (`id` = '2');");
  }
};
