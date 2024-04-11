'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `firstNightsRefundRestriction`=1 WHERE `id` IN (1,2);")
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `firstNightsRefundRestriction`=0 WHERE `id` IN (1,2);")
    ])
  }
};
