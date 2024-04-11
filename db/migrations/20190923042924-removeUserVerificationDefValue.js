'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
       queryInterface.sequelize.query("UPDATE UserVerifiedInfo SET isIdVerification = NULL"),      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE UserVerifiedInfo SET isIdVerification = NULL"),      
    ])
  }
};
