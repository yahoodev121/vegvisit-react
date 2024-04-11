'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `guestFeePriorCheckIn`=0;"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `guestFeeBeforeCheckIn`=0;")
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `guestFeePriorCheckIn`=100;"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `guestFeeBeforeCheckIn`=100;")
    ])
  }
};
