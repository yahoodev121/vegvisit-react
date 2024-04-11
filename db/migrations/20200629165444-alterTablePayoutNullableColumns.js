

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 'ALTER TABLE `Payout` CHANGE COLUMN `city` `city` VARCHAR(255) NULL, CHANGE COLUMN `zipcode` `zipcode` VARCHAR(255) NULL, CHANGE COLUMN `state` `state` VARCHAR(255) NULL;'
    return Promise.all([
      queryInterface.changeColumn('Payout', 'city', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Payout', 'zipcode', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Payout', 'state', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Payout', 'city', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Payout', 'zipcode', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Payout', 'state', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
