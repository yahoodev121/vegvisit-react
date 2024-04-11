'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([ 
    queryInterface.addColumn('Threads', 'isRead', {
      type: Sequelize.BOOLEAN
    })
  ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.removeColumn('Threads', 'isRead')
  ])
  }
};