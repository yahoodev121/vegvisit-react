'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'companionAnimals', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'lifestyle', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.removeColumn('UserProfile', 'diet'),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'companionAnimals'),
      queryInterface.removeColumn('UserProfile', 'lifestyle'),
      queryInterface.removeColumn('UserProfile', 'diet'),
    ])
  }
};
