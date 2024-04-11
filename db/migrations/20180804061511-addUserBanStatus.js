'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return  Promise.all([
    queryInterface.addColumn('User', 'userBanStatus', {
      type: Sequelize.BOOLEAN
    })
  ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
     queryInterface.removeColumn('User', 'userBanStatus')
    ])
  }
};
