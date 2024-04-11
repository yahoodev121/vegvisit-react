'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Reservation', 'paymentState', {
        type: Sequelize.ENUM('pending','completed','expired'),
      })
    ])   
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Reservation', 'paymentState')
      ])   
  }
};
