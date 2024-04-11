'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isEnable` = '0' WHERE (`id` = '3');");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `isEnable` = '1' WHERE (`id` = '3');");
  }
};
