'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return Promise.all([
      queryInterface.changeColumn('UserVerifiedInfo', 'isIdVerification', {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserVerifiedInfo', 'isIdVerification')
    ])
  }
};
