'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'foodCategory', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'foodCategory'),
    ])
    }
};
