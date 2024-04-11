'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `Cancellation` SET `guestCancellationTimeThreshold`='11:00:00';");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `Cancellation` SET `guestCancellationTimeThreshold`='15:00:00';");
  }
};
