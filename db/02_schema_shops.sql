-- Gegenereerd op 2026-10-26 uit Dump20240103.sql (alleen structuur)

CREATE DATABASE  IF NOT EXISTS `shops` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `shops`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `Address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `house_number` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `house_addition` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `zipcode` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Business_Hours` (
  `business_hours_id` int NOT NULL AUTO_INCREMENT,
  `weekday` int DEFAULT NULL,
  `week` int DEFAULT '0' COMMENT '''if not default''',
  `default` tinyint DEFAULT NULL,
  `start` time DEFAULT NULL,
  `end` time DEFAULT NULL,
  `shop_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `custom_label` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `year` int DEFAULT NULL,
  PRIMARY KEY (`business_hours_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Delivery_Location` (
  `delivery_location_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `zipcode` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`delivery_location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Discount_Folder` (
  `discount_folder_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`discount_folder_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Folder_Pages` (
  `folder_pages_id` int NOT NULL AUTO_INCREMENT,
  `discount_folder_id` int DEFAULT NULL,
  `page_number` int DEFAULT NULL,
  `page_src` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`folder_pages_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Information` (
  `information_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `phone` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mail` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `kvk` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `btw` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mobile` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `admin_mail` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `contact_image_url` varchar(445) COLLATE utf8_bin DEFAULT NULL,
  `logo_url` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`information_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Job_Application` (
  `job_application_id` char(36) COLLATE utf8_bin NOT NULL,
  `name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `zipcode` varchar(15) COLLATE utf8_bin DEFAULT NULL,
  `house_number` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `house_addition` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `phonenumber` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `cv` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `motivatie` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `beschikbaarheid` text COLLATE utf8_bin,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `status` varchar(45) COLLATE utf8_bin NOT NULL DEFAULT 'open',
  `job_offer_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `opmerkingen` text COLLATE utf8_bin,
  PRIMARY KEY (`job_application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Job_Offer` (
  `job_offer_id` char(36) COLLATE utf8_bin NOT NULL,
  `title` varchar(145) COLLATE utf8_bin DEFAULT NULL,
  `description` text COLLATE utf8_bin,
  `experience` text COLLATE utf8_bin,
  `labour_conditions` text COLLATE utf8_bin,
  `expires_at` datetime DEFAULT NULL,
  `hours` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `shop_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`job_offer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Shops` (
  `shop_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shopname` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `database_name` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `database_pw` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `database_user` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `information_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `styling_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `domain` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `TAC_id` int DEFAULT NULL,
  `store_number` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Socials` (
  `social_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `url` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `visible` tinyint DEFAULT NULL,
  `shop_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`social_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Terms_And_Conditions` (
  `TAC_id` int NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8_bin,
  PRIMARY KEY (`TAC_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Timeslots` (
  `timeslot_id` int NOT NULL AUTO_INCREMENT,
  `timeslot_date` date DEFAULT NULL,
  `timeslot_start` time DEFAULT NULL,
  `timeslot_end` time DEFAULT NULL,
  `shop_id` char(36) COLLATE utf8_bin DEFAULT '31bc6562-6672-11ed-b67e-0242ac110003',
  `is_delivery` tinyint DEFAULT '0',
  `available_slots` int DEFAULT '25',
  PRIMARY KEY (`timeslot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
