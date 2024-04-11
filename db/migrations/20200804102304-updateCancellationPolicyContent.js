'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `policyContent` = 'Cancel up to 24 hours before your trip and get a full refund minus service fees back.', updatedAt = CURRENT_TIMESTAMP() WHERE (`id` = '1');"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `policyContent` = 'Cancel up to 5 days before your trip and get a full refund minus service fees back.', updatedAt = CURRENT_TIMESTAMP() WHERE (`id` = '2');"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `policyContent` = 'Cancel up to 7 days before your trip and get a 50% refund minus service fees back.', updatedAt = CURRENT_TIMESTAMP() WHERE (`id` = '3');"),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `policyContent` = 'Cancel up to 24 hours before your trip and get a 100% refund plus service fees back.', updatedAt = CURRENT_TIMESTAMP() WHERE (`id` = '1');"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `policyContent` = 'Cancel up to 5 days before your trip and get a full refund. Cancel within 5 days of the trip and get a 50% refund of the nightly rate, as well as a full refund of fees.', updatedAt = CURRENT_TIMESTAMP() WHERE (`id` = '2');"),
      queryInterface.sequelize.query("UPDATE `Cancellation` SET `policyContent` = 'Cancel up to 7 days before your trip and get a 50% refund plus service fees back.', updatedAt = CURRENT_TIMESTAMP() WHERE (`id` = '3');"),
    ]);
  }
};
