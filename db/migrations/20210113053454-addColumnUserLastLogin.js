'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'lastLogin', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'updatedAt',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('User', 'lastLogin');
  }
};