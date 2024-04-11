'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.addColumn('WishList', 'isListActive', {
      type: Sequelize.BOOLEAN
    })
  ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.removeColumn('WishList', 'isListActive')
  ])
  }
};