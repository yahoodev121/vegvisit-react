'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("ALTER TABLE `UserAmenities` ADD INDEX `amenitiesId` (`amenitiesId`);"),
      queryInterface.sequelize.query("ALTER TABLE `UserAmenities` ADD CONSTRAINT `UserAmenities_ibfk_2` FOREIGN KEY (`amenitiesId`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` ADD INDEX `listId` (`listId`);"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` ADD CONSTRAINT `UserServices_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` ADD INDEX `serviceId` (`serviceId`);"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` ADD CONSTRAINT `UserServices_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),

      // queryInterface.sequelize.query("ALTER TABLE `Reservation` ADD INDEX `listId` (`listId`);"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` ADD INDEX `hostId` (`hostId`);"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`hostId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` ADD INDEX `guestId` (`guestId`);"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_ibfk_3` FOREIGN KEY (`guestId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` COLLATE = utf8mb4_unicode_ci;"), // must be the same as for User table, otherwise FK creation will fail
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` ADD INDEX `userId` (`userId`);"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` ADD CONSTRAINT `UserDiets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` ADD INDEX `dietId` (`dietId`);"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` ADD CONSTRAINT `UserDiets_ibfk_2` FOREIGN KEY (`dietId`) REFERENCES `Diet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),

      queryInterface.sequelize.query("ALTER TABLE `Reviews` ADD INDEX `listId` (`listId`);"),
      queryInterface.sequelize.query("ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_ibfk_3` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"),
      queryInterface.sequelize.query("ALTER TABLE UserVerifiedInfo DROP INDEX userId, ADD UNIQUE userId (userId);"),
      // Don't add this one, it leads to problems in the application since currently the ordering matters and is changed by the new index
      // queryInterface.sequelize.query("ALTER TABLE UserListingData ADD UNIQUE listSettings (listId, settingsId);"),
      queryInterface.sequelize.query("ALTER TABLE BedTypes ADD UNIQUE listBedTypes (listId, bedCount, bedType)"),
      queryInterface.sequelize.query("ALTER TABLE ListingData DROP INDEX listId, ADD UNIQUE listId (listId)"),
      queryInterface.sequelize.query("ALTER TABLE UserListingSteps DROP INDEX listId, ADD UNIQUE listId (listId)"),
      queryInterface.sequelize.query("ALTER TABLE UserAmenities ADD UNIQUE listAmenities (listId, amenitiesId);"),
      queryInterface.sequelize.query("ALTER TABLE UserSafetyAmenities ADD UNIQUE listSafetyAmenities (listId, safetyAmenitiesId);"),
      queryInterface.sequelize.query("ALTER TABLE UserHouseRules ADD UNIQUE listHouseRules (listId, houseRulesId);"),
      queryInterface.sequelize.query("ALTER TABLE UserSpaces ADD UNIQUE listSpaces (listId, spacesId);"),
      queryInterface.sequelize.query("ALTER TABLE UserServices ADD UNIQUE listServices (listId, serviceId);"),
      queryInterface.sequelize.query("ALTER TABLE ListPhotos ADD UNIQUE listPhotos (listId, name);"),
      queryInterface.sequelize.query("ALTER TABLE UserDiets ADD UNIQUE userDiets (userId, dietId);"),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("ALTER TABLE `UserAmenities` DROP FOREIGN KEY `UserAmenities_ibfk_2`;"),
      queryInterface.sequelize.query("ALTER TABLE `UserAmenities` DROP INDEX `amenitiesId`;"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` DROP FOREIGN KEY `UserServices_ibfk_1`;"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` DROP INDEX `listId`;"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` DROP FOREIGN KEY `UserServices_ibfk_2`;"),
      queryInterface.sequelize.query("ALTER TABLE `UserServices` DROP INDEX `serviceId`;"),

      // queryInterface.sequelize.query("ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_ibfk_1`;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` DROP INDEX `listId`;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_ibfk_2`;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` DROP INDEX `hostId`;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_ibfk_3`;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reservation` DROP INDEX `guestId`;"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` DROP FOREIGN KEY `UserDiets_ibfk_1`;"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` DROP INDEX `userId`;"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` DROP FOREIGN KEY `UserDiets_ibfk_2`;"),
      // queryInterface.sequelize.query("ALTER TABLE `UserDiets` DROP INDEX `dietId`;"),
      // queryInterface.sequelize.query("ALTER TABLE `Reviews` DROP FOREIGN KEY `Reviews_ibfk_1`;"),
      
      queryInterface.sequelize.query("ALTER TABLE `Reviews` DROP FOREIGN KEY `Reviews_ibfk_3`;"),
      queryInterface.sequelize.query("ALTER TABLE `Reviews` DROP INDEX `listId`;"),
      queryInterface.sequelize.query("ALTER TABLE UserVerifiedInfo DROP INDEX userId, ADD INDEX userId (userId);"),
      // queryInterface.sequelize.query("ALTER TABLE UserListingData DROP INDEX listSettings;"),
      queryInterface.sequelize.query("ALTER TABLE BedTypes DROP INDEX listBedTypes;"),
      queryInterface.sequelize.query("ALTER TABLE ListingData DROP INDEX listId, ADD INDEX listId (listId);"),
      queryInterface.sequelize.query("ALTER TABLE UserListingSteps DROP INDEX listId, ADD INDEX listId (listId)"),
      queryInterface.sequelize.query("ALTER TABLE UserAmenities DROP INDEX listAmenities;"),
      queryInterface.sequelize.query("ALTER TABLE UserSafetyAmenities DROP INDEX listSafetyAmenities;"),
      queryInterface.sequelize.query("ALTER TABLE UserHouseRules DROP INDEX listHouseRules;"),
      queryInterface.sequelize.query("ALTER TABLE UserSpaces DROP INDEX listSpaces;"),
      queryInterface.sequelize.query("ALTER TABLE UserServices DROP INDEX listServices;"),
      queryInterface.sequelize.query("ALTER TABLE ListPhotos DROP INDEX listPhotos;"),
      queryInterface.sequelize.query("ALTER TABLE UserDiets DROP INDEX userDiets;"),
    ]);
  },
};
