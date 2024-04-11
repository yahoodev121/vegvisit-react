'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn(
        'Cancellation',
        'firstNightsRefundRestriction',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          after: 'hostFeeDuringCheckIn'
        }
      ),
      queryInterface.addColumn(
        'Cancellation',
        'firstNightsRefundable',
        {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
          after: 'firstNightsRefundRestriction'
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn('Cancellation', 'firstNightsRefundRestriction'),
      queryInterface.removeColumn('Cancellation', 'firstNightsRefundable')
    ]);
  }
};
