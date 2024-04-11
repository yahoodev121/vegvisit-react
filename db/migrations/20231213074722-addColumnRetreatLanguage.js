'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ListingRetreats', 'languageId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'RetreatLanguages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ListingRetreats', 'languageId');
  }
};
