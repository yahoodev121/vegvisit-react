'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cancellation', 'guestCancellationTimeThreshold', {
      type: Sequelize.TIME,
      defaultValue: '15:00:00',
      allowNull: false,
      after: 'firstNightsRefundable'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Cancellation', 'guestCancellationTimeThreshold');
  }
};