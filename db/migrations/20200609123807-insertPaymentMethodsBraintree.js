'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `PaymentMethods` VALUES (3,'Braintree','Depending on payment method','Depending on payment method','USD','Choose your payment method',1,NOW(),NOW(),3)");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DELETE FROM `PaymentMethods` WHERE ID = 3");
  }
};
