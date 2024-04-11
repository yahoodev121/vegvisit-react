'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('TransactionHistory', 'transactionStatus', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'transactionId',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('TransactionHistory', 'transactionStatus');
  }
};
