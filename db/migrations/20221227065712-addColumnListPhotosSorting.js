'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ListPhotos', 'sorting', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'isCover',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ListPhotos', 'sorting');
  }
};
