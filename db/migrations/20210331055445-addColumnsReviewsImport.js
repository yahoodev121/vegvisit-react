'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Reviews', 'importUserName', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Reviews', 'importUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Reviews', 'importDateInfo', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Reviews', 'importUserName'),
      queryInterface.removeColumn('Reviews', 'importUrl'),
      queryInterface.removeColumn('Reviews', 'importDateInfo'),
    ]);
  }
};
