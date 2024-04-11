'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('TransactionHistory', 'platformTransactionId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'transactionStatus',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('TransactionHistory', 'platformTransactionId');
  }
};
