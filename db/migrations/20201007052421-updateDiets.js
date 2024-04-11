'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `Diet` SET `createdAt`='2020-06-05', `updatedAt`='2020-06-05';");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE `Diet` SET `createdAt`=NULL, `updatedAt`=NULL;");
  }
};
