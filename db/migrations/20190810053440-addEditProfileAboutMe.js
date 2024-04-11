'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'diet', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'spokenLanguages', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'funFacts', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'hobbies', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'books', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'music', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'movies', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'quote', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'school', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('UserProfile', 'work', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'diet'),
      queryInterface.removeColumn('UserProfile', 'spokenLanguages'),
      queryInterface.removeColumn('UserProfile', 'funFacts'),
      queryInterface.removeColumn('UserProfile', 'hobbies'),
      queryInterface.removeColumn('UserProfile', 'books'),
      queryInterface.removeColumn('UserProfile', 'music'),
      queryInterface.removeColumn('UserProfile', 'movies'),
      queryInterface.removeColumn('UserProfile', 'quote'),
      queryInterface.removeColumn('UserProfile', 'school'),
      queryInterface.removeColumn('UserProfile', 'work'),
    ])
  }
};
