'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PaymentMethods', 'isPayoutMethod', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: 'paymentType',
      defaultValue: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PaymentMethods', 'isPayoutMethod');
  }
};
