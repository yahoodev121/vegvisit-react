'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Transaction', 'platformTransactionId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'transactionStatus',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Transaction', 'platformTransactionId');
  }
};
