/*
SQLyog Trial v13.1.8 (64 bit)
MySQL - 10.4.32-MariaDB : Database - vegvisits
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`vegvisits` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `vegvisits`;

/*Table structure for table `AdminUser` */

DROP TABLE IF EXISTS `AdminUser`;

CREATE TABLE `AdminUser` (
  `id` char(36) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `emailConfirmed` tinyint(1) DEFAULT 0,
  `isSuperAdmin` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `admin_user_email` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Areas` */

DROP TABLE IF EXISTS `Areas`;

CREATE TABLE `Areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Atmospheres` */

DROP TABLE IF EXISTS `Atmospheres`;

CREATE TABLE `Atmospheres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Banner` */

DROP TABLE IF EXISTS `Banner`;

CREATE TABLE `Banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `BedTypes` */

DROP TABLE IF EXISTS `BedTypes`;

CREATE TABLE `BedTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `bedCount` int(11) DEFAULT NULL,
  `bedType` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listBedTypes` (`listId`,`bedCount`,`bedType`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `bedType` (`bedType`) USING BTREE,
  CONSTRAINT `BedTypes_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BedTypes_ibfk_2` FOREIGN KEY (`bedType`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=358 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `BlogDetails` */

DROP TABLE IF EXISTS `BlogDetails`;

CREATE TABLE `BlogDetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` mediumtext NOT NULL,
  `pageUrl` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `footerCategory` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Cancellation` */

DROP TABLE IF EXISTS `Cancellation`;

CREATE TABLE `Cancellation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policyName` varchar(255) NOT NULL,
  `policyContent` mediumtext DEFAULT NULL,
  `priorDays` int(11) NOT NULL,
  `accommodationPriorCheckIn` float NOT NULL,
  `accommodationBeforeCheckIn` float NOT NULL,
  `accommodationDuringCheckIn` float NOT NULL,
  `guestFeePriorCheckIn` float NOT NULL,
  `guestFeeBeforeCheckIn` float NOT NULL,
  `guestFeeDuringCheckIn` float NOT NULL,
  `hostFeePriorCheckIn` float NOT NULL,
  `hostFeeBeforeCheckIn` float NOT NULL,
  `hostFeeDuringCheckIn` float NOT NULL,
  `firstNightsRefundRestriction` int(11) NOT NULL DEFAULT 0,
  `firstNightsRefundable` float NOT NULL DEFAULT 0,
  `guestCancellationTimeThreshold` time NOT NULL DEFAULT '15:00:00',
  `hostCancellationTimeThreshold` time NOT NULL DEFAULT '08:00:00',
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `CancellationDetails` */

DROP TABLE IF EXISTS `CancellationDetails`;

CREATE TABLE `CancellationDetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `cancellationPolicy` varchar(255) NOT NULL,
  `refundToGuest` float NOT NULL,
  `payoutToHost` float NOT NULL,
  `guestServiceFee` float NOT NULL,
  `hostServiceFee` float NOT NULL,
  `total` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `cancelledBy` enum('host','guest') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `reservationId` (`reservationId`) USING BTREE,
  CONSTRAINT `CancellationDetails_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Country` */

DROP TABLE IF EXISTS `Country`;

CREATE TABLE `Country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `countryCode` varchar(255) NOT NULL,
  `countryName` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime DEFAULT '2018-09-29 11:22:19',
  `updatedAt` datetime DEFAULT '2018-09-29 11:22:19',
  `dialCode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Currencies` */

DROP TABLE IF EXISTS `Currencies`;

CREATE TABLE `Currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `isBaseCurrency` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isPayment` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `CurrencyRates` */

DROP TABLE IF EXISTS `CurrencyRates`;

CREATE TABLE `CurrencyRates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `currencyCode` varchar(255) NOT NULL,
  `rate` float NOT NULL,
  `isBase` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=460 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Diet` */

DROP TABLE IF EXISTS `Diet`;

CREATE TABLE `Diet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dietName` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `DocumentVerification` */

DROP TABLE IF EXISTS `DocumentVerification`;

CREATE TABLE `DocumentVerification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `fileType` varchar(255) DEFAULT NULL,
  `documentStatus` enum('pending','approved') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `EmailToken` */

DROP TABLE IF EXISTS `EmailToken`;

CREATE TABLE `EmailToken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  CONSTRAINT `EmailToken_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `FooterBlock` */

DROP TABLE IF EXISTS `FooterBlock`;

CREATE TABLE `FooterBlock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title1` varchar(255) NOT NULL,
  `content1` text NOT NULL,
  `title2` varchar(255) NOT NULL,
  `content2` text NOT NULL,
  `title3` varchar(255) NOT NULL,
  `content3` text NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ForgotPassword` */

DROP TABLE IF EXISTS `ForgotPassword`;

CREATE TABLE `ForgotPassword` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  CONSTRAINT `ForgotPassword_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `HasRetreatAreas` */

DROP TABLE IF EXISTS `HasRetreatAreas`;

CREATE TABLE `HasRetreatAreas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listingRetreatId` int(11) NOT NULL,
  `areaId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listingRetreatId` (`listingRetreatId`) USING BTREE,
  KEY `areaId` (`areaId`) USING BTREE,
  CONSTRAINT `HasRetreatAreas_ibfk_1` FOREIGN KEY (`listingRetreatId`) REFERENCES `ListingRetreats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `HasRetreatAreas_ibfk_2` FOREIGN KEY (`areaId`) REFERENCES `Areas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `HasRetreatAtmospheres` */

DROP TABLE IF EXISTS `HasRetreatAtmospheres`;

CREATE TABLE `HasRetreatAtmospheres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listingRetreatId` int(11) NOT NULL,
  `atmosphereId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listingRetreatId` (`listingRetreatId`) USING BTREE,
  KEY `atmosphereId` (`atmosphereId`) USING BTREE,
  CONSTRAINT `HasRetreatAtmospheres_ibfk_1` FOREIGN KEY (`listingRetreatId`) REFERENCES `ListingRetreats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `HasRetreatAtmospheres_ibfk_2` FOREIGN KEY (`atmosphereId`) REFERENCES `Atmospheres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `HasRetreatMeals` */

DROP TABLE IF EXISTS `HasRetreatMeals`;

CREATE TABLE `HasRetreatMeals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listingRetreatId` int(11) NOT NULL,
  `mealId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listingRetreatId` (`listingRetreatId`) USING BTREE,
  KEY `mealId` (`mealId`) USING BTREE,
  CONSTRAINT `HasRetreatMeals_ibfk_1` FOREIGN KEY (`listingRetreatId`) REFERENCES `ListingRetreats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `HasRetreatMeals_ibfk_2` FOREIGN KEY (`mealId`) REFERENCES `Meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `HomeBanner` */

DROP TABLE IF EXISTS `HomeBanner`;

CREATE TABLE `HomeBanner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `enable` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ImageBanner` */

DROP TABLE IF EXISTS `ImageBanner`;

CREATE TABLE `ImageBanner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `buttonLabel` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListBlockedDates` */

DROP TABLE IF EXISTS `ListBlockedDates`;

CREATE TABLE `ListBlockedDates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `reservationId` int(11) DEFAULT NULL,
  `blockedDates` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `calendarId` int(11) DEFAULT NULL,
  `calendarStatus` enum('available','blocked','reservation') DEFAULT NULL,
  `isSpecialPrice` float DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `reservationId` (`reservationId`) USING BTREE,
  CONSTRAINT `ListBlockedDates_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ListBlockedDates_ibfk_2` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1447 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListCalendar` */

DROP TABLE IF EXISTS `ListCalendar`;

CREATE TABLE `ListCalendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` mediumtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `ListCalendar_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListPhotos` */

DROP TABLE IF EXISTS `ListPhotos`;

CREATE TABLE `ListPhotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT '0',
  `isCover` int(11) DEFAULT 0,
  `sorting` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listPhotos` (`listId`,`name`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `ListPhotos_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListSettings` */

DROP TABLE IF EXISTS `ListSettings`;

CREATE TABLE `ListSettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeId` int(11) NOT NULL,
  `itemName` varchar(255) DEFAULT NULL,
  `otherItemName` varchar(255) DEFAULT NULL,
  `maximum` int(11) DEFAULT NULL,
  `minimum` int(11) DEFAULT NULL,
  `startValue` int(11) DEFAULT NULL,
  `endValue` int(11) DEFAULT NULL,
  `step` varchar(255) DEFAULT NULL,
  `isEnable` varchar(255) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `itemDescription` text DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `typeId` (`typeId`) USING BTREE,
  CONSTRAINT `ListSettings_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `ListSettingsTypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=389 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListSettingsTypes` */

DROP TABLE IF EXISTS `ListSettingsTypes`;

CREATE TABLE `ListSettingsTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeName` varchar(255) NOT NULL,
  `fieldType` enum('stringType','numberType') DEFAULT 'stringType',
  `step` int(11) DEFAULT 1,
  `isEnable` varchar(255) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `typeLabel` varchar(255) DEFAULT NULL,
  `isMultiValue` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListViews` */

DROP TABLE IF EXISTS `ListViews`;

CREATE TABLE `ListViews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `userId` char(36) NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Listing` */

DROP TABLE IF EXISTS `Listing`;

CREATE TABLE `Listing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `roomType` varchar(255) DEFAULT NULL,
  `houseType` varchar(255) DEFAULT NULL,
  `residenceType` varchar(255) DEFAULT NULL,
  `bedrooms` varchar(255) DEFAULT NULL,
  `buildingSize` varchar(255) DEFAULT NULL,
  `bedType` varchar(255) DEFAULT NULL,
  `beds` int(11) DEFAULT NULL,
  `personCapacity` int(11) DEFAULT NULL,
  `bathrooms` float DEFAULT NULL,
  `bathroomType` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `buildingName` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `isMapTouched` tinyint(1) DEFAULT 0,
  `timeZone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `coverPhoto` int(11) DEFAULT NULL,
  `bookingType` enum('request','instant') NOT NULL DEFAULT 'instant',
  `isPublished` tinyint(1) NOT NULL DEFAULT 0,
  `lastPublished` datetime DEFAULT NULL,
  `isReady` tinyint(1) NOT NULL DEFAULT 0,
  `reviewsCount` tinyint(1) DEFAULT 0,
  `kitchen` varchar(255) DEFAULT NULL,
  `nonVeg` varchar(255) DEFAULT NULL,
  `aboutPlaces` text DEFAULT NULL,
  `aboutKitchen` text DEFAULT NULL,
  `neighourhood` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `services` varchar(255) DEFAULT NULL,
  `moreDetails` text DEFAULT NULL,
  `listingStatus` tinyint(1) DEFAULT 0,
  `calendarExportSecret` varchar(255) DEFAULT NULL,
  `lastReviewsImportAirbnb` datetime DEFAULT NULL,
  `reviewsImportUrlAirbnb` varchar(255) DEFAULT NULL,
  `listType` enum('Stays','Stays with Experience','Retreats') NOT NULL DEFAULT 'Stays',
  `experienceCategory` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  CONSTRAINT `Listing_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListingData` */

DROP TABLE IF EXISTS `ListingData`;

CREATE TABLE `ListingData` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) DEFAULT NULL,
  `bookingNoticeTime` varchar(255) DEFAULT NULL,
  `checkInStart` varchar(255) NOT NULL DEFAULT 'Flexible',
  `checkInEnd` varchar(255) NOT NULL DEFAULT 'Flexible',
  `minNight` varchar(255) DEFAULT NULL,
  `maxNight` varchar(255) DEFAULT NULL,
  `priceMode` tinyint(1) DEFAULT NULL,
  `basePrice` float DEFAULT 0,
  `maxPrice` float DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `hostingFrequency` varchar(255) DEFAULT NULL,
  `weeklyDiscount` float DEFAULT NULL,
  `monthlyDiscount` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cleaningPrice` float DEFAULT 0,
  `maxDaysNotice` enum('unavailable','3months','6months','9months','12months','available') NOT NULL DEFAULT 'unavailable',
  `cancellationPolicy` int(11) DEFAULT 1,
  `additionalRules` text DEFAULT NULL,
  `securityDeposit` float DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `ListingData_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ListingRetreatCategory` */

DROP TABLE IF EXISTS `ListingRetreatCategory`;

CREATE TABLE `ListingRetreatCategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) DEFAULT NULL,
  `category` text DEFAULT NULL,
  `subCategory` text DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ListingRetreatCategory_fk_listId` (`listId`),
  CONSTRAINT `ListingRetreatCategory_fk_listId` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ListingRetreats` */

DROP TABLE IF EXISTS `ListingRetreats`;

CREATE TABLE `ListingRetreats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `accommodations` text DEFAULT NULL,
  `teachers` text DEFAULT NULL,
  `eventType` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `country` text DEFAULT NULL,
  `street` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `languageId` int(11) DEFAULT NULL,
  `zipcode` text DEFAULT NULL,
  `lat` text DEFAULT NULL,
  `lng` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `includes` text DEFAULT NULL,
  `not_includes` text DEFAULT NULL,
  `special` text DEFAULT NULL,
  `full_description` text DEFAULT NULL,
  `meal` text DEFAULT NULL,
  `drink` text DEFAULT NULL,
  `currency` text DEFAULT NULL,
  `reatreat_dates` text DEFAULT NULL,
  `min_days` int(11) DEFAULT NULL,
  `isAllowPayment` tinyint(4) DEFAULT NULL,
  `isCash` tinyint(4) DEFAULT NULL,
  `addons` text DEFAULT NULL,
  `allow_flexibility` text DEFAULT NULL,
  `use_increase_booking` text DEFAULT NULL,
  `free_gift_name` text DEFAULT NULL,
  `free_gift_desc` text DEFAULT NULL,
  `localInfoDesc` text DEFAULT NULL,
  `localInformation` text DEFAULT NULL,
  `facilityFeatures` text DEFAULT NULL,
  `seasonalInformation` text DEFAULT NULL,
  `treavelHelp` text DEFAULT NULL,
  `instagram_url` text DEFAULT NULL,
  `subCategory` text DEFAULT NULL,
  `RetreatStyle` text DEFAULT NULL,
  `atmospheres` text DEFAULT NULL,
  `yogaTypes` text DEFAULT NULL,
  `skillLevels` text DEFAULT NULL,
  `food` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `itinerary` text DEFAULT NULL,
  `cancellationPolicy` text DEFAULT NULL,
  `state` text DEFAULT NULL,
  `retreat_dates` text DEFAULT NULL,
  `travelHelp` text DEFAULT NULL,
  `showType` int(11) DEFAULT 1,
  `reviews` text DEFAULT NULL,
  `Seats` int(11) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `ListingRetreats_languageId_foreign_idx` (`languageId`) USING BTREE,
  CONSTRAINT `ListingRetreats_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Meals` */

DROP TABLE IF EXISTS `Meals`;

CREATE TABLE `Meals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mealType` varchar(255) NOT NULL,
  `mealIcon` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `PaymentMethods` */

DROP TABLE IF EXISTS `PaymentMethods`;

CREATE TABLE `PaymentMethods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `processedIn` varchar(255) DEFAULT NULL,
  `fees` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `details` mediumtext DEFAULT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentType` tinyint(1) DEFAULT 1,
  `isPayoutMethod` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `PaymentSettings` */

DROP TABLE IF EXISTS `PaymentSettings`;

CREATE TABLE `PaymentSettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentName` varchar(255) NOT NULL,
  `paymentStatus` enum('true','false') DEFAULT 'false',
  `paymentMode` enum('live','sandbox') DEFAULT 'sandbox',
  `email` varchar(255) DEFAULT NULL,
  `APIUserId` varchar(255) DEFAULT NULL,
  `APIPassword` varchar(255) DEFAULT NULL,
  `APISecret` varchar(255) DEFAULT NULL,
  `AppId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Payout` */

DROP TABLE IF EXISTS `Payout`;

CREATE TABLE `Payout` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `methodId` int(11) NOT NULL,
  `userId` char(36) NOT NULL,
  `payEmail` varchar(255) NOT NULL,
  `address1` mediumtext DEFAULT NULL,
  `address2` mediumtext DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `default` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `last4Digits` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  CONSTRAINT `Payout_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `PopularLocation` */

DROP TABLE IF EXISTS `PopularLocation`;

CREATE TABLE `PopularLocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `locationAddress` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Recommend` */

DROP TABLE IF EXISTS `Recommend`;

CREATE TABLE `Recommend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ReportUser` */

DROP TABLE IF EXISTS `ReportUser`;

CREATE TABLE `ReportUser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reporterId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `reportType` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `RequestBookingList` */

DROP TABLE IF EXISTS `RequestBookingList`;

CREATE TABLE `RequestBookingList` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) DEFAULT NULL,
  `host` varchar(255) NOT NULL,
  `guest` varchar(255) NOT NULL,
  `checkInStart` datetime DEFAULT NULL,
  `checkInEnd` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=339 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Reservation` */

DROP TABLE IF EXISTS `Reservation`;

CREATE TABLE `Reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `hostId` varchar(255) NOT NULL,
  `guestId` varchar(255) NOT NULL,
  `checkIn` datetime NOT NULL,
  `checkOut` datetime NOT NULL,
  `guests` int(11) DEFAULT 1,
  `message` mediumtext DEFAULT NULL,
  `basePrice` float NOT NULL,
  `cleaningPrice` float DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `discount` float DEFAULT NULL,
  `discountType` varchar(255) DEFAULT NULL,
  `guestServiceFee` float DEFAULT NULL,
  `hostServiceFee` float DEFAULT NULL,
  `total` float NOT NULL,
  `confirmationCode` int(11) DEFAULT NULL,
  `paymentState` enum('pending','completed','expired') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `payoutId` int(11) DEFAULT NULL,
  `reservationState` enum('pending','approved','declined','completed','cancelled','expired') NOT NULL DEFAULT 'pending',
  `paymentMethodId` tinyint(1) DEFAULT NULL,
  `cancellationPolicy` int(11) DEFAULT NULL,
  `isSpecialPriceAverage` float DEFAULT NULL,
  `dayDifference` float DEFAULT NULL,
  `isPreApprove` tinyint(1) DEFAULT 0,
  `paymentIntentId` varchar(255) DEFAULT NULL,
  `isValid` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=418 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ReservationSpecialPricing` */

DROP TABLE IF EXISTS `ReservationSpecialPricing`;

CREATE TABLE `ReservationSpecialPricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) DEFAULT NULL,
  `reservationId` int(11) DEFAULT NULL,
  `blockedDates` datetime NOT NULL,
  `isSpecialPrice` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `RetreatCategories` */

DROP TABLE IF EXISTS `RetreatCategories`;

CREATE TABLE `RetreatCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parentId` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `eventType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `RetreatLanguages` */

DROP TABLE IF EXISTS `RetreatLanguages`;

CREATE TABLE `RetreatLanguages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Reviews` */

DROP TABLE IF EXISTS `Reviews`;

CREATE TABLE `Reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `listId` int(11) NOT NULL,
  `authorId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `reviewContent` text DEFAULT NULL,
  `rating` float NOT NULL,
  `privateFeedback` mediumtext DEFAULT NULL,
  `parentId` int(11) DEFAULT 0,
  `automated` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `isAdminEnable` int(11) DEFAULT 1,
  `userStatus` varchar(255) DEFAULT NULL,
  `importUserName` varchar(255) DEFAULT NULL,
  `importUrl` varchar(255) DEFAULT NULL,
  `importDateInfo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `reservationId` (`reservationId`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Reviews_ibfk_3` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2993 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `SearchSettings` */

DROP TABLE IF EXISTS `SearchSettings`;

CREATE TABLE `SearchSettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `minPrice` float NOT NULL,
  `maxPrice` float NOT NULL,
  `PriceRangecurrency` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `SequelizeMeta` */

DROP TABLE IF EXISTS `SequelizeMeta`;

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE,
  UNIQUE KEY `SequelizeMeta_name_unique` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ServiceFees` */

DROP TABLE IF EXISTS `ServiceFees`;

CREATE TABLE `ServiceFees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guestType` enum('fixed','percentage') NOT NULL,
  `guestValue` float NOT NULL,
  `hostType` enum('fixed','percentage') NOT NULL,
  `hostValue` float NOT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `SiteSettings` */

DROP TABLE IF EXISTS `SiteSettings`;

CREATE TABLE `SiteSettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `StaticPage` */

DROP TABLE IF EXISTS `StaticPage`;

CREATE TABLE `StaticPage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageName` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` mediumtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `ThreadItems` */

DROP TABLE IF EXISTS `ThreadItems`;

CREATE TABLE `ThreadItems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `threadId` int(11) NOT NULL,
  `sentBy` varchar(255) NOT NULL,
  `content` mediumtext DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT NULL,
  `type` enum('message','inquiry','preApproved','declined','approved','pending','cancelledByHost','cancelledByGuest','intantBooking','requestToBook','confirmed','expired','completed','paymentExpire') DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `personCapacity` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `reservationId` int(11) DEFAULT NULL,
  `messageType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `threadId` (`threadId`) USING BTREE,
  CONSTRAINT `ThreadItems_ibfk_1` FOREIGN KEY (`threadId`) REFERENCES `Threads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Threads` */

DROP TABLE IF EXISTS `Threads`;

CREATE TABLE `Threads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `host` varchar(255) NOT NULL,
  `guest` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isRead` tinyint(1) DEFAULT NULL,
  `messageUpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `Threads_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `Transaction` */

DROP TABLE IF EXISTS `Transaction`;

CREATE TABLE `Transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `payerEmail` varchar(255) DEFAULT NULL,
  `payerId` varchar(255) DEFAULT NULL,
  `receiverEmail` varchar(255) DEFAULT NULL,
  `receiverId` varchar(255) DEFAULT NULL,
  `transactionId` varchar(255) DEFAULT '1',
  `transactionStatus` varchar(255) DEFAULT NULL,
  `platformTransactionId` varchar(255) DEFAULT NULL,
  `total` float NOT NULL,
  `transactionFee` float DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `ipn_track_id` varchar(255) DEFAULT NULL,
  `paymentType` enum('booking','cancellation','host') DEFAULT 'booking',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentMethodId` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `reservationId` (`reservationId`) USING BTREE,
  CONSTRAINT `Transaction_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=198 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `TransactionHistory` */

DROP TABLE IF EXISTS `TransactionHistory`;

CREATE TABLE `TransactionHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `userId` char(36) NOT NULL,
  `payoutId` int(11) NOT NULL,
  `payoutEmail` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `fees` float DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `transactionStatus` varchar(255) DEFAULT NULL,
  `platformTransactionId` varchar(255) DEFAULT NULL,
  `paymentMethodId` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `reservationId` (`reservationId`) USING BTREE,
  CONSTRAINT `TransactionHistory_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `User` */

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` char(36) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `emailConfirmed` tinyint(1) DEFAULT 0,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `userBanStatus` tinyint(1) DEFAULT 0,
  `userDeletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_email` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserAmenities` */

DROP TABLE IF EXISTS `UserAmenities`;

CREATE TABLE `UserAmenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `amenitiesId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listAmenities` (`listId`,`amenitiesId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `amenitiesId` (`amenitiesId`) USING BTREE,
  CONSTRAINT `UserAmenities_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserAmenities_ibfk_2` FOREIGN KEY (`amenitiesId`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=375 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserClaim` */

DROP TABLE IF EXISTS `UserClaim`;

CREATE TABLE `UserClaim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  CONSTRAINT `UserClaim_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserDiets` */

DROP TABLE IF EXISTS `UserDiets`;

CREATE TABLE `UserDiets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `dietId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `userDiets` (`userId`,`dietId`) USING BTREE,
  KEY `userId` (`userId`) USING BTREE,
  KEY `dietId` (`dietId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserHouseRules` */

DROP TABLE IF EXISTS `UserHouseRules`;

CREATE TABLE `UserHouseRules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `houseRulesId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listHouseRules` (`listId`,`houseRulesId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `houseRulesId` (`houseRulesId`) USING BTREE,
  CONSTRAINT `UserHouseRules_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserHouseRules_ibfk_2` FOREIGN KEY (`houseRulesId`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserListingData` */

DROP TABLE IF EXISTS `UserListingData`;

CREATE TABLE `UserListingData` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `settingsId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `UserListingData_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=484 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserListingSteps` */

DROP TABLE IF EXISTS `UserListingSteps`;

CREATE TABLE `UserListingSteps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `step1` enum('inactive','active','completed') DEFAULT 'inactive',
  `step2` enum('inactive','active','completed') DEFAULT 'inactive',
  `step3` enum('inactive','active','completed') DEFAULT 'inactive',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `UserListingSteps_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserLogin` */

DROP TABLE IF EXISTS `UserLogin`;

CREATE TABLE `UserLogin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `deviceType` varchar(255) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `deviceDetail` mediumtext DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserProfile` */

DROP TABLE IF EXISTS `UserProfile`;

CREATE TABLE `UserProfile` (
  `userId` char(36) NOT NULL DEFAULT '',
  `profileId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `displayName` varchar(100) DEFAULT NULL,
  `dateOfBirth` varchar(100) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `preferredLanguage` varchar(50) DEFAULT NULL,
  `preferredCurrency` varchar(50) DEFAULT NULL,
  `info` mediumtext DEFAULT NULL,
  `location` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `stripeCusId` varchar(255) DEFAULT NULL,
  `country` int(11) DEFAULT 1,
  `verificationCode` int(11) DEFAULT NULL,
  `countryCode` varchar(10) DEFAULT NULL,
  `countryName` varchar(255) DEFAULT NULL,
  `spokenLanguages` text DEFAULT NULL,
  `funFacts` text DEFAULT NULL,
  `hobbies` text DEFAULT NULL,
  `books` text DEFAULT NULL,
  `music` text DEFAULT NULL,
  `movies` text DEFAULT NULL,
  `quote` text DEFAULT NULL,
  `school` text DEFAULT NULL,
  `work` text DEFAULT NULL,
  `companionAnimals` text DEFAULT NULL,
  `lifestyle` text DEFAULT NULL,
  `foodCategory` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`) USING BTREE,
  UNIQUE KEY `profileId` (`profileId`) USING BTREE,
  UNIQUE KEY `UserProfile_profileId_unique` (`profileId`) USING BTREE,
  CONSTRAINT `UserProfile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserSafetyAmenities` */

DROP TABLE IF EXISTS `UserSafetyAmenities`;

CREATE TABLE `UserSafetyAmenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `safetyAmenitiesId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listSafetyAmenities` (`listId`,`safetyAmenitiesId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `UserSafetyAmenities_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserServices` */

DROP TABLE IF EXISTS `UserServices`;

CREATE TABLE `UserServices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) DEFAULT NULL,
  `serviceId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listServices` (`listId`,`serviceId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `serviceId` (`serviceId`) USING BTREE,
  CONSTRAINT `UserServices_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserServices_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserSpaces` */

DROP TABLE IF EXISTS `UserSpaces`;

CREATE TABLE `UserSpaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) NOT NULL,
  `spacesId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `listSpaces` (`listId`,`spacesId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  KEY `spacesId` (`spacesId`) USING BTREE,
  CONSTRAINT `UserSpaces_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserSpaces_ibfk_2` FOREIGN KEY (`spacesId`) REFERENCES `ListSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `UserVerifiedInfo` */

DROP TABLE IF EXISTS `UserVerifiedInfo`;

CREATE TABLE `UserVerifiedInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `isEmailConfirmed` tinyint(1) DEFAULT 0,
  `isFacebookConnected` tinyint(1) DEFAULT 0,
  `isGoogleConnected` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isIdVerification` tinyint(1) DEFAULT 0,
  `isPhoneVerified` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `userId` (`userId`) USING BTREE,
  CONSTRAINT `UserVerifiedInfo_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `WishList` */

DROP TABLE IF EXISTS `WishList`;

CREATE TABLE `WishList` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wishListGroupId` int(11) NOT NULL,
  `listId` int(11) NOT NULL,
  `userId` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isListActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `wishListGroupId` (`wishListGroupId`) USING BTREE,
  KEY `listId` (`listId`) USING BTREE,
  CONSTRAINT `WishList_ibfk_1` FOREIGN KEY (`wishListGroupId`) REFERENCES `WishListGroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `WishList_ibfk_2` FOREIGN KEY (`listId`) REFERENCES `Listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*Table structure for table `WishListGroup` */

DROP TABLE IF EXISTS `WishListGroup`;

CREATE TABLE `WishListGroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `userId` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `isPublic` int(11) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
