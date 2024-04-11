'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `Currencies` (`id`, `symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('33', 'TWD', '1', '0', '1', NOW(), NOW());");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DELETE FROM `Currencies` WHERE `id` = '33'");
  }
};
