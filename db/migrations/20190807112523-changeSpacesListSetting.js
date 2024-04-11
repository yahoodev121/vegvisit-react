'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
       queryInterface.sequelize.query("UPDATE ListSettingsTypes SET typeLabel = 'Features'  WHERE id =12"),      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE ListSettingsTypes SET typeLabel = 'Features'  WHERE id = 12"),      
    ])
  }
};
