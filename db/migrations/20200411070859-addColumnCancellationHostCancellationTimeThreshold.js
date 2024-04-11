'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Cancellation', 'hostCancellationTimeThreshold', {
      type: Sequelize.TIME,
      defaultValue: '08:00:00',
      allowNull: false,
      after: 'firstNightsRefundable'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Cancellation', 'hostCancellationTimeThreshold');
  }
};
