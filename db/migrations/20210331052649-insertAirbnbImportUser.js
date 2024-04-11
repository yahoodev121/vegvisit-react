'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([ 
        queryInterface.sequelize.query("INSERT INTO `User` (`id`, `email`, `password`, `emailConfirmed`, `type`, `userBanStatus`, `createdAt`, `updatedAt`) VALUES ('00001', 'airbnbimport@vegvisits.com', 'noLoginUser', '1', 'email', '0', NOW(), NOW());", { transaction: t }),
        queryInterface.sequelize.query("INSERT INTO `UserProfile` (`userId`, `displayName`, `info`, `createdAt`, `updatedAt`) VALUES ('00001', 'Airbnb Import User', 'System user', NOW(), NOW());", { transaction: t })
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.sequelize.query("DELETE FROM `UserProfile` WHERE `userId`='00001'", { transaction: t }),
        queryInterface.sequelize.query("DELETE FROM `User` WHERE `id`='00001'", { transaction: t })
      ]);
    });
  }
};
