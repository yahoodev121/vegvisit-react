'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `Currencies` SET `isPayment`= 0 WHERE `symbol` IN ('BGN', 'TRY');");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `Currencies` SET `isPayment`= 1 WHERE `symbol` IN ('BGN', 'TRY');");
  }
};
