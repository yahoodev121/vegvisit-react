'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `SiteSettings` (`id`, `title`, `name`, `value`, `type`, `createdAt`, `updatedAt`) VALUES ('5', 'Open Graph Image', 'openGraphImage', 'https://vegvisits.nyc3.digitaloceanspaces.com/images/openGraph/Vegvisits_OpenGraph_v1_cropped_v2.png', 'site_settings', NOW(), NOW());");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DELETE FROM `SiteSettings` WHERE `id` = '5'");
  }
};
