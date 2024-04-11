'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Transaction', 'transactionStatus', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'transactionId',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Transaction', 'transactionStatus');
  }
};
