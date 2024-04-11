'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Transaction', 'disbursementDate'),
      queryInterface.removeColumn('Transaction', 'disbursedAmount'),
      queryInterface.removeColumn('Transaction', 'disbursedCurrency'),
      queryInterface.removeColumn('Transaction', 'disbursementExchangeRate'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Transaction', 'disbursementDate', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }),
      queryInterface.addColumn('Transaction', 'disbursedAmount', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
      queryInterface.addColumn('Transaction', 'disbursedCurrency', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Transaction', 'disbursementExchangeRate', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
    ]);
  },
};
