'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.addColumn('User', 'userDeletedAt', {
      type: Sequelize.DATE,
      defaultValue: null
    })
  ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([ 
    queryInterface.removeColumn('User', 'userDeletedAt')
  ])
  }
};