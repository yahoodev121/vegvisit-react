'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListingRetreats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      listId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Listing',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      highlights: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          const value = this.getDataValue('highlights');
          return value ? JSON.parse(value) : null;
        },
        set(value) {
          this.setDataValue('highlights', value ? JSON.stringify(value) : null);
        }
      },
      // categoryId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'RetreatCategories',
      //     key: 'id'
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE'
      // },
      categories: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      yogaTypes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      atmospheres: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      skillLevels: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ages: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      cancellationPolicy: {
        type: Sequelize.INTEGER,
      },
      food: {
        type: Sequelize.TEXT,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER
      },
      numberSeats: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      searchResultsBulletpoints: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          const value = this.getDataValue('searchResultsBulletpoints');
          return value ? JSON.parse(value) : null;
        },
        set(value) {
          this.setDataValue('searchResultsBulletpoints', value ? JSON.stringify(value) : null);
        }
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      itinerary: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      accommodation: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ListingRetreats');
  }
};
