'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `hostFeePriorCheckIn`=0;"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `hostFeeBeforeCheckIn`=0;"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `hostFeeDuringCheckIn`=0;")
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `hostFeePriorCheckIn`=100;"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `hostFeeBeforeCheckIn`=100;"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `hostFeeDuringCheckIn`=100;")
    ])
  }
};