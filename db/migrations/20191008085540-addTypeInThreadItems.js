'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ThreadItems', 'messageType', {
        type: Sequelize.STRING
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ThreadItems', 'messageType'),
    ])
    }
};
