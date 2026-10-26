-- Gegenereerd op 2026-10-26 uit Dump20240103 (3).sql (alleen structuur)

CREATE DATABASE  IF NOT EXISTS `cooplubbers_test` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cooplubbers_test`;

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

CREATE TABLE IF NOT EXISTS `Access` (
  `access_id` char(36) COLLATE utf8_bin NOT NULL,
  `code` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `expire` int DEFAULT NULL,
  `customer_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`access_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Actie_Order` (
  `actie_order_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `spaaractie_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `order_information_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `pickup_date` date DEFAULT NULL,
  `status` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `pickup_time` time DEFAULT NULL,
  `paycode` varchar(145) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `delivery_cost` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `delivery` tinyint DEFAULT '0',
  `invoice_order_information_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `picking_user` char(36) COLLATE utf8_bin DEFAULT NULL,
  `picking_time` datetime DEFAULT NULL,
  `pickedup_time` datetime DEFAULT NULL,
  `pickup_user` char(36) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`actie_order_id`),
  KEY `idx_spaaractie` (`spaaractie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Actie_Order_Product_has_Variant` (
  `actie_order_product_variant_id` int NOT NULL AUTO_INCREMENT,
  `actie_order_has_product_id` int NOT NULL,
  `product_variant_id` int NOT NULL,
  PRIMARY KEY (`actie_order_product_variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Actie_Order_has_Product` (
  `actie_order_has_product_id` int NOT NULL AUTO_INCREMENT,
  `actie_order_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `product_id` int NOT NULL,
  `amount` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stamps_cost` int DEFAULT NULL,
  `picked` int DEFAULT '0',
  `returned` int DEFAULT '0',
  `reason_return` varchar(1024) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`actie_order_has_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Cookies` (
  `cookie_id` int NOT NULL AUTO_INCREMENT,
  `device` varchar(245) DEFAULT NULL,
  `acceptance_date` datetime DEFAULT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `cookie_type` varchar(45) DEFAULT NULL,
  `ip` varchar(245) DEFAULT NULL,
  `user_auth` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`cookie_id`),
  KEY `fk_user_idx` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Customer` (
  `customer_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'UUID()',
  `first_name` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updates` tinyint DEFAULT '0',
  `surname` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `accessToken` varchar(545) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `storepoints` int DEFAULT '0',
  `gender` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `klantenkaart` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `activated` datetime DEFAULT NULL,
  `resettoken` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `coopkaart` tinyint DEFAULT '0',
  `waitinglist` int DEFAULT '0',
  `phone` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `default_information` char(36) COLLATE utf8_bin DEFAULT NULL,
  `default_invoice_information` char(36) COLLATE utf8_bin DEFAULT NULL,
  `default_work_information` char(36) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id_UNIQUE` (`customer_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Customer_Information` (
  `customer_information_id` char(36) COLLATE utf8_bin NOT NULL,
  `first_name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `surname` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `street` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `house_number` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `house_addition` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `zipcode` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `business` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `kvk` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `btw` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `customer_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `title` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `contactperson` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `businessphone` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `custom_label` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`customer_information_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Customer_Settings` (
  `customer_settings_id` int NOT NULL AUTO_INCREMENT,
  `shoptype` int DEFAULT NULL,
  `shopheight` int DEFAULT NULL,
  `customer_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `standard_promotions` tinyint DEFAULT NULL,
  `standard_storestamps` tinyint DEFAULT NULL,
  `easy_order` tinyint DEFAULT NULL,
  `quick_scan` tinyint DEFAULT NULL,
  PRIMARY KEY (`customer_settings_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Customer_has_Favorite` (
  `customer_has_favorite_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`customer_has_favorite_id`),
  KEY `fk_customer_idx` (`customer_id`),
  KEY `fk_customer_favorites_idx` (`customer_id`),
  KEY `fk_product_favorites_idx` (`product_id`),
  CONSTRAINT `fk_customer_favorites` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_favorites` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Customer_has_Spaaractie` (
  `customer_has_spaaractie_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UUID()',
  `customer_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `spaaractie_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `stamp_amount` int DEFAULT NULL,
  `point_amount` int DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`customer_has_spaaractie_id`),
  UNIQUE KEY `customer_has_spaaractie_id_UNIQUE` (`customer_has_spaaractie_id`),
  KEY `fk_customer_idx` (`customer_id`),
  KEY `fk_spaaractie_idx` (`spaaractie_id`),
  CONSTRAINT `fk_customer` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_spaaractie` FOREIGN KEY (`spaaractie_id`) REFERENCES `Spaaractie` (`spaaractie_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Daytotals` (
  `daytotal_id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `total_revenue` decimal(10,2) DEFAULT '0.00',
  `user_id` char(36) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`daytotal_id`),
  KEY `user_id_fk_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(245) DEFAULT NULL,
  `name` varchar(245) DEFAULT NULL,
  `slug` varchar(245) DEFAULT NULL,
  `main_department` int DEFAULT NULL,
  `nix18` tinyint DEFAULT '0',
  `visible` tinyint DEFAULT '1',
  `imgurl` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  KEY `fk_main_department_idx` (`main_department`),
  CONSTRAINT `fk_main_department` FOREIGN KEY (`main_department`) REFERENCES `Department` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `DiscountType` (
  `discounttype_id` int NOT NULL,
  `discounttype_label` varchar(245) DEFAULT NULL,
  `min_amount` int DEFAULT '1',
  `default_calculation` float DEFAULT '1',
  PRIMARY KEY (`discounttype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Discount_has_Images` (
  `discount_has_images_id` int NOT NULL AUTO_INCREMENT,
  `discount_id` int DEFAULT NULL,
  `image_id` int DEFAULT NULL,
  `isMain` tinyint DEFAULT '0',
  PRIMARY KEY (`discount_has_images_id`),
  KEY `fk_d_i_discount_id_idx` (`discount_id`),
  KEY `fk_d_i_image_id_idx` (`image_id`),
  CONSTRAINT `fk_d_i_discount_id` FOREIGN KEY (`discount_id`) REFERENCES `Discounts` (`discount_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_d_i_image_id` FOREIGN KEY (`image_id`) REFERENCES `Images` (`images_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Discounts` (
  `discount_id` int NOT NULL AUTO_INCREMENT,
  `starting_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `discounttype_id` int DEFAULT NULL,
  `discount_image_url` varchar(245) DEFAULT NULL,
  `isCombination` tinyint DEFAULT '0',
  PRIMARY KEY (`discount_id`),
  KEY `fk_discount_type_id_idx` (`discounttype_id`),
  CONSTRAINT `fk_discount_type_id` FOREIGN KEY (`discounttype_id`) REFERENCES `DiscountType` (`discounttype_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Images` (
  `images_id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(245) DEFAULT NULL,
  `name` varchar(245) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`images_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Levertijden` (
  `levertijd_id` int NOT NULL AUTO_INCREMENT,
  `minimum_days` int DEFAULT '0',
  `maximum_days` int DEFAULT NULL,
  `label` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`levertijd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `NutrientRecords` (
  `nutrient_record_id` int NOT NULL AUTO_INCREMENT,
  `precision_type_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `record_uom_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `default_amount` float DEFAULT NULL,
  `default_gda` float DEFAULT NULL,
  `portion_amount` float DEFAULT NULL,
  `portion_gda` float DEFAULT NULL,
  `nutrient_id` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `nutrient_type_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`nutrient_record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `NutrientTypes` (
  `nutrient_type_id` char(36) COLLATE utf8_bin NOT NULL,
  `name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `internal_name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`nutrient_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Nutrients` (
  `nutrients_id` char(36) COLLATE utf8_bin NOT NULL,
  `product_id` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `syndyid` char(36) COLLATE utf8_bin DEFAULT NULL,
  `has_portion` tinyint DEFAULT NULL,
  `portion_size` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `portion_uom_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `NutrientId` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`nutrients_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `uuid_id` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'UUID()',
  `totalPrice` decimal(13,2) DEFAULT NULL,
  `paymentMethod` varchar(245) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `orderDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pickupDate` date DEFAULT NULL,
  `status` varchar(245) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Pending',
  `customer_id` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `pickupTime` time DEFAULT NULL,
  `pickingcrate` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `paycode` varchar(145) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `winkelbon` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `finalPrice` decimal(10,2) DEFAULT NULL,
  `pickingtime` datetime DEFAULT NULL,
  `koopzegels` int DEFAULT '0',
  `spaarzegels` varchar(3000) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `picking_price` decimal(10,2) NOT NULL DEFAULT '3.00',
  `pickup_code` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `pickup_confirm` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `id_check` varchar(245) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `scanningtime` datetime DEFAULT NULL,
  `pickedup_time` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `picking_user` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `scanning_user` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `pickup_user` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `order_information_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `storepoints` int DEFAULT '0',
  `delivery` tinyint DEFAULT '0',
  `deletedAt` datetime DEFAULT NULL,
  `invoice_order_information_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `invoice_number` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`order_id`,`uuid_id`),
  KEY `fk_Order_Picking_User_idx` (`picking_user`) /*!80000 INVISIBLE */,
  KEY `fk_Order_Scanning_User_idx` (`scanning_user`),
  KEY `fk_Order_Pickup_User_idx` (`pickup_user`) /*!80000 INVISIBLE */,
  KEY `fk_Order_Information_idx` (`order_information_id`),
  CONSTRAINT `fk_Order_Information` FOREIGN KEY (`order_information_id`) REFERENCES `Order_Information` (`order_information_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_Picker` FOREIGN KEY (`picking_user`) REFERENCES `User` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_Pickup` FOREIGN KEY (`pickup_user`) REFERENCES `User` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_Scanner` FOREIGN KEY (`scanning_user`) REFERENCES `User` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Order_Information` (
  `order_information_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `customerName` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `customerEmail` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `klantenkaart` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `customerPhone` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `customer_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `street` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `house_number` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `house_addition` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `city` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `zipcode` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `business` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `kvk` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `default` tinyint DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  `btw` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `first_name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `surname` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `contactperson` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `businessphone` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`order_information_id`),
  KEY `fk_customer_idx` (`customer_id`),
  KEY `fk_order_customer_idx` (`customer_id`),
  CONSTRAINT `fk_Order_customer` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Order_has_Product` (
  `Order_has_Product_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `picked` int DEFAULT '0',
  `returned` int DEFAULT '0',
  `reason_return` varchar(1024) DEFAULT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `discount_override` int DEFAULT NULL,
  `normal_total_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Order_has_Product_id`),
  KEY `fk_Order_has_Product_Order_idx` (`order_id`),
  KEY `fk_Order_has_Product_Product_idx` (`product_id`),
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `Order` (`order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `PortionUoMs` (
  `PortionUoMs_id` char(36) COLLATE utf8_bin NOT NULL,
  `label` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`PortionUoMs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `PrecisionTypes` (
  `PrecisionTypes_id` char(36) COLLATE utf8_bin NOT NULL,
  `name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `internal_name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`PrecisionTypes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `categoryname1` varchar(245) DEFAULT NULL,
  `categoryname2` varchar(245) DEFAULT NULL,
  `itemtype` varchar(245) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `ean` varchar(45) DEFAULT NULL,
  `discountPrice` decimal(10,2) DEFAULT '0.00',
  `schaphoogte` int DEFAULT NULL,
  `schapplaats` int DEFAULT NULL,
  `beschikbaar` int DEFAULT '0',
  `schapcode` varchar(45) DEFAULT NULL,
  `btw` float DEFAULT '9',
  `statiegeld` decimal(10,2) DEFAULT '0.00',
  `end_of_life` int DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '1',
  `nix18` tinyint DEFAULT '0',
  `department_id` int DEFAULT NULL,
  `levertijd_id` int DEFAULT '1',
  `categoryname3` varchar(245) DEFAULT NULL,
  `syndyid` varchar(50) DEFAULT NULL,
  `previous_price` decimal(10,2) DEFAULT NULL,
  `sup_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `fk_department_idx` (`department_id`) /*!80000 INVISIBLE */,
  KEY `fk_levertijden_idx` (`levertijd_id`),
  FULLTEXT KEY `search` (`ean`,`categoryname2`,`categoryname1`),
  CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `Department` (`department_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Product_Additional_Information` (
  `product_additional_information_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `value` text COLLATE utf8_bin,
  `product_information_id` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `type` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`product_additional_information_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Product_Information` (
  `product_information_id` int NOT NULL AUTO_INCREMENT,
  `ean` varchar(245) NOT NULL,
  `variant` varchar(245) DEFAULT NULL,
  `title` varchar(245) DEFAULT NULL,
  `url` varchar(245) DEFAULT NULL,
  `dataproduct` varchar(545) DEFAULT NULL,
  `datasyndyproductid` varchar(245) DEFAULT NULL,
  `datasyndyfont` varchar(245) DEFAULT NULL,
  `omschrijving` text,
  `imgurl` varchar(245) DEFAULT NULL,
  `manufacturer` varchar(245) DEFAULT NULL,
  `ingredients` text,
  PRIMARY KEY (`product_information_id`),
  FULLTEXT KEY `search` (`omschrijving`,`title`,`variant`,`ingredients`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Product_Variant` (
  `product_variant_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `price_override` decimal(10,2) DEFAULT NULL,
  `discount_price_override` decimal(10,2) DEFAULT NULL,
  `beschikbaar_override` int DEFAULT NULL,
  `schapcode_override` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `end_of_life_override` int DEFAULT NULL,
  `stock_override` int DEFAULT NULL,
  `variant_group` int DEFAULT NULL,
  `variant_label` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`product_variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Product_has_Discount` (
  `product_discount_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `discount_id` int DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT '0.00',
  `isPercentage` tinyint DEFAULT '0',
  PRIMARY KEY (`product_discount_id`),
  KEY `fk_product_id_idx` (`product_id`),
  KEY `fk_discount_id_idx` (`discount_id`),
  CONSTRAINT `fk_discount_id_disc` FOREIGN KEY (`discount_id`) REFERENCES `Discounts` (`discount_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_id_disc` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `RecordUoMs` (
  `RecordUoMs_id` char(36) COLLATE utf8_bin NOT NULL,
  `label` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`RecordUoMs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `ShoppingList` (
  `shopping_list_id` char(36) COLLATE utf8_bin NOT NULL,
  `customer_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`shopping_list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `ShoppingList_has_Products` (
  `list_product_id` int NOT NULL AUTO_INCREMENT,
  `shopping_list_id` char(36) COLLATE utf8_bin DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  PRIMARY KEY (`list_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Spaaractie` (
  `spaaractie_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `title` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `slug` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `imgurl` varchar(545) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `amount_of_stamps` int DEFAULT NULL,
  `stamp_price` decimal(10,2) unsigned zerofill DEFAULT NULL,
  `stamp_imgurl` varchar(545) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `background_card` varchar(545) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  `front_imgurl` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `back_imgurl` varchar(245) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `point_for_stamp` int DEFAULT NULL,
  `price_visible` tinyint DEFAULT '1',
  `list_image` varchar(545) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `maincolor` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '#ffffff',
  `actietype_id` int DEFAULT '1',
  `tac` varchar(245) COLLATE utf8_bin DEFAULT NULL,
  `tac_pages` int DEFAULT '0',
  `TAC_id` int DEFAULT NULL,
  `physical` tinyint DEFAULT '0',
  `koptekst` text COLLATE utf8_bin,
  PRIMARY KEY (`spaaractie_id`),
  UNIQUE KEY `acties_id_UNIQUE` (`spaaractie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Spaaractie_has_Product` (
  `spaaractie_has_product_id` int NOT NULL AUTO_INCREMENT,
  `points_cost` int DEFAULT NULL,
  `stamps_cost` int DEFAULT NULL,
  `title` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `discount_percentage` float DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `spaaractie_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`spaaractie_has_product_id`),
  KEY `fk_prod_idx` (`product_id`),
  CONSTRAINT `fk_prod` FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `Terms_And_Conditions` (
  `TAC_id` int NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8_bin,
  PRIMARY KEY (`TAC_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `User` (
  `user_id` char(36) NOT NULL DEFAULT 'UUID()',
  `name` varchar(245) DEFAULT NULL,
  `cardnumber` varchar(245) DEFAULT NULL,
  `phone` varchar(245) DEFAULT NULL,
  `email` varchar(245) DEFAULT NULL,
  `password` varchar(245) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `role_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `accessToken` varchar(545) DEFAULT NULL,
  `expires_in` datetime DEFAULT NULL,
  `nfc_token` varchar(45) DEFAULT NULL,
  `nfc_serial` varchar(45) DEFAULT NULL,
  `store` varchar(45) DEFAULT 'COOP',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uuid_id_UNIQUE` (`user_id`),
  UNIQUE KEY `cardnumber_UNIQUE` (`cardnumber`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_user_role_idx` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Userrole` (
  `role_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `role_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
