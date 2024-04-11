'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Listing', 'lastPublished', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'isPublished',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Listing', 'lastPublished');
  }
};
