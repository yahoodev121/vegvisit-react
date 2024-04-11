'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Listing', 'listType', {
      type: Sequelize.ENUM('Stays', 'Stays with Experience', 'Retreats'),
      allowNull: false,
      defaultValue: 'Stays'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Listing', 'listType');
  }
};
