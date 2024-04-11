'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isEnable` = '0' WHERE (`id` = '2');"),
      queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isPayoutMethod` = '1' WHERE (`id` = '1');"),
      queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `details` = 'Connect your existing PayPal account (or create a new one)' WHERE (`id` = '1');"),
      queryInterface.sequelize.query("INSERT INTO `PaymentMethods` VALUES (4,'Venmo','','','USD','Get paid with Venmo (U.S. phone number required)',1,NOW(),NOW(),4,1)"),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isEnable` = '1' WHERE (`id` = '2');"),
      queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isPayoutMethod` = '0' WHERE (`id` = '1');"),
      queryInterface.sequelize.query("DELETE FROM `PaymentMethods` WHERE ID = 4"),
    ])
  }
};