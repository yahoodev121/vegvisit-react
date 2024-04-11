'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Reservation', 'isPreApprove', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Reservation', 'isPreApprove'),
    ])
    }
};
