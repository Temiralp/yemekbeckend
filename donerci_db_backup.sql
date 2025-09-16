/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.25-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: donerci_db
-- ------------------------------------------------------
-- Server version	10.5.25-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('registered','guest') DEFAULT 'registered',
  `title` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `neighborhood` varchar(50) NOT NULL,
  `street` varchar(100) DEFAULT NULL,
  `address_detail` text NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `guest_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_addresses_guest` (`guest_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_addresses_guest` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (2,NULL,'guest','Geçici Adres','Ankara','Çankaya','Kızılay','Atatürk Bulvarı','No: 456',0,1),(57,56,'registered','Ev Adresim','İstanbul','Kadıköy','Caferağa','Moda Caddesi','No: 123, Kat: 2, Daire: 5',0,NULL),(58,56,'registered','Ev','İstanbul','Beşiktaş','Etiler','Çırağan Sokak','Teddjjf',0,NULL),(59,56,'registered','Test','Ankara','Çankaya','Çukurambar','Kızılırmak Sokak','Sjdksls',0,NULL),(60,56,'registered','Ev','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Ehrken',1,NULL),(61,85,'registered','Ev','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Hdhd',0,NULL),(62,86,'registered','Test','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Tgg',0,NULL),(63,88,'registered','Gh','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Fjşş',1,NULL),(64,89,'registered','Hh','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Gjk',1,NULL),(65,92,'registered','Jdkdjfkfk','Ankara','Çankaya','Çukurambar','Kızılırmak Sokak','Kdkd',0,NULL),(66,93,'registered','Ev','Ankara','Çankaya','Çukurambar','Kızılırmak Sokak','Fjj',0,NULL),(67,94,'registered','İs','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Fkşg',0,NULL),(68,96,'registered','Ev','Ankara','Çankaya','Çukurambar','Kızılırmak Sokak','Jdkslshdh',0,NULL),(69,101,'registered','Ev','İstanbul','Beşiktaş','Etiler','Çırağan Sokak','Jrrjejjssj',0,NULL),(70,102,'registered','Sjsha','Ankara','Çankaya','Çukurambar','Turan Güneş Bulvarı','Hshewjwh',0,NULL),(74,105,'registered','Test','İstanbul','Üsküdar','Beylerbeyi','Çayır Sokak','Djdj',0,NULL),(76,85,'registered','Trh','ankara','test2','yesy','ankara','Djll',0,NULL),(77,85,'registered','Ev','istanbul','avcılar','cihangir','sandal','Hdlsşejhspeşw',0,NULL),(78,85,'registered','Ev','istanbul','avcılar','cihangir','sandal','Ssjd',0,NULL),(79,85,'registered','Dhdh','DİYARBAKIR ','BİSMİL','Akpınar','AKPINAR CADDESİ','Gddklashs',0,NULL),(81,107,'registered','Ev','DİYARBAKIR ','BİSMİL','nokta','sandal sokak','Djd',0,NULL),(82,107,'registered','Ev','DİYARBAKIR ','BİSMİL','nokta','sandal sokak','Djd',0,NULL),(83,85,'registered','Ev','DİYARBAKIR ','BİSMİL','nokta','sandal sokak','Dhslsj',0,NULL),(84,85,'registered','Ebek','DİYARBAKIR ','BİSMİL','ulutürk','sandal sokak','Hdjswj',1,NULL),(85,108,'registered','Dukan ','DİYARBAKIR ','BİSMİL','Altıok','test','Yörem döner \n',0,NULL);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('registered','guest') DEFAULT 'registered',
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `options` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `added_at` datetime DEFAULT current_timestamp(),
  `guest_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_cart_guest` (`guest_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_guest` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,'registered',1,2,'{\"option\": \"Ekstra Peynir\"}','Az tuzlu olsun','2025-03-24 16:56:28',NULL),(2,NULL,'guest',1,1,NULL,'Hızlı teslimat','2025-03-24 16:58:21',1),(98,86,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:44:26',NULL),(99,86,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:45:36',NULL),(100,87,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:47:08',NULL),(101,87,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:47:53',NULL),(102,87,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:48:51',NULL),(103,87,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:49:01',NULL),(104,87,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:51:56',NULL),(105,88,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 18:57:13',NULL),(106,88,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 19:01:12',NULL),(107,88,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 19:01:18',NULL),(108,89,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 19:01:31',NULL),(109,89,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 19:02:26',NULL),(110,90,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 19:03:08',NULL),(125,91,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 20:35:22',NULL),(126,91,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 20:39:31',NULL),(127,91,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 20:40:01',NULL),(128,91,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 20:42:17',NULL),(129,91,'registered',2,2,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 20:42:40',NULL),(130,91,'registered',2,1,'Ekstra Peynir','Az tuzlu olsun','2025-03-30 20:43:16',NULL),(146,104,'registered',4,1,'Ekstra Peynir','Az tuzlu olsun','2025-04-09 15:36:16',NULL),(192,107,'registered',41,1,'Büyük Boy','Az tuzlu olsun','2025-05-16 14:20:03',NULL),(193,107,'registered',32,1,'Orta Boy','Az tuzlu olsun','2025-05-16 14:20:10',NULL),(194,107,'registered',32,1,'Orta Boy','Az tuzlu olsun','2025-05-16 14:20:18',NULL),(196,107,'registered',57,3,'Büyük Boy','Az tuzlu olsun','2025-05-16 14:24:38',NULL),(200,85,'registered',57,1,'Orta Boy','Az tuzlu olsun','2025-05-16 14:57:48',NULL),(201,85,'registered',26,1,'Orta Boy','Az tuzlu olsun','2025-05-16 14:58:28',NULL),(202,109,'registered',26,2,'Büyük Boy','Az tuzlu olsun','2025-05-16 15:16:50',NULL),(203,109,'registered',29,2,'Büyük Boy','Az tuzlu olsun','2025-05-16 15:16:58',NULL),(204,85,'registered',26,2,'Orta Boy','Az tuzlu olsun','2025-05-16 15:24:19',NULL),(210,111,'registered',27,6,'Büyük Boy','Az tuzlu olsun','2025-05-19 11:20:36',NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Burgerssss','',0,'2025-03-24 16:50:22','2025-05-07 04:44:24'),(4,'Pizza',NULL,0,'2025-03-29 10:43:16','2025-05-12 07:02:59'),(5,'YİYECEKLER','',1,'2025-04-16 14:05:28','2025-05-13 14:04:04'),(6,'test11','aga',0,'2025-04-16 14:10:20','2025-04-21 17:05:36'),(7,'yumurtalar','test',0,'2025-04-21 17:08:01','2025-05-12 07:01:20'),(8,'İÇECEKLER','',1,'2025-05-12 07:24:14','2025-05-13 14:04:35'),(9,'tst','test',0,'2025-05-12 14:22:41','2025-05-12 14:25:12');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_coupon_staff` (`created_by`),
  CONSTRAINT `fk_coupon_staff` FOREIGN KEY (`created_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'INDIRIM10',NULL,'',10.00,50.00,'2025-01-01 00:00:00','2025-12-31 00:00:00',100,0,'2025-03-24 16:58:21','2025-05-05 22:08:58',NULL,0);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `districts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `region_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `region_id` (`region_id`),
  CONSTRAINT `fk_districts_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (3,2,'BİSMİL',1);
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_users`
--

DROP TABLE IF EXISTS `guest_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guest_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(2000) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `first_seen` datetime DEFAULT current_timestamp(),
  `last_active` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_id` (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_users`
--

LOCK TABLES `guest_users` WRITE;
/*!40000 ALTER TABLE `guest_users` DISABLE KEYS */;
INSERT INTO `guest_users` VALUES (1,'test-token-123','device-123','Android','Samsung Galaxy S21','2025-03-24 16:47:57','2025-03-24 16:47:57');
/*!40000 ALTER TABLE `guest_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `neighborhoods`
--

DROP TABLE IF EXISTS `neighborhoods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `neighborhoods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `district_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `district_id` (`district_id`),
  CONSTRAINT `fk_neighborhoods_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `neighborhoods`
--

LOCK TABLES `neighborhoods` WRITE;
/*!40000 ALTER TABLE `neighborhoods` DISABLE KEYS */;
INSERT INTO `neighborhoods` VALUES (4,3,'Altıok',1),(5,3,'Akpınar',1),(6,3,'EsenTepe',1),(7,3,'nokta',1),(8,3,'fatih',1),(9,3,'sanayi',1),(10,3,'şentepe',1),(11,3,'fırat ',1),(12,3,'ulutürk',1),(13,3,'seyrantepe',1),(14,3,'tekel',1),(15,3,'kurtuluş',1),(16,3,'dicle ',1);
/*!40000 ALTER TABLE `neighborhoods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipient_id` int(11) NOT NULL,
  `recipient_type` enum('customer','staff') NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `type` varchar(50) NOT NULL,
  `related_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `options` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,4,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(2,4,4,1,69.90,'Ekstra Peynir','Az tuzlu olsun'),(3,4,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(4,5,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(5,6,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(6,7,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(7,8,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(8,9,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(9,10,4,1,69.90,'Ekstra Peynir','Az tuzlu olsun'),(10,11,4,1,69.90,'Ekstra Peynir','Az tuzlu olsun'),(11,12,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(12,13,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(13,14,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(14,15,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(15,16,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(16,17,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(17,18,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(18,19,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(19,20,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(20,21,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(21,22,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(22,23,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(23,24,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(24,25,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(25,26,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(26,27,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(27,28,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(28,29,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(29,30,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(30,31,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(31,32,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(32,33,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(33,33,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(34,34,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(35,35,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(36,36,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(37,37,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(38,38,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(39,39,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(40,40,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(41,41,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(42,41,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(43,42,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(44,43,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(45,44,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(46,45,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(47,46,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(48,46,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(49,47,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(50,47,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(51,48,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(52,49,4,1,69.90,'Ekstra Peynir','Az tuzlu olsun'),(53,49,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(54,49,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(55,49,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(56,50,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(57,51,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(58,51,4,3,69.90,'Ekstra Peynir','Az tuzlu olsun'),(59,52,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(60,53,2,2,45.00,'Ekstra Peynir','Az tuzlu olsun'),(61,54,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(62,55,2,2,45.00,'Ekstra Peynir','Az tuzlu olsun'),(63,56,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(64,56,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(65,57,2,2,45.00,'Ekstra Peynir','Az tuzlu olsun'),(66,57,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(67,57,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(68,58,2,4,45.00,'Ekstra Peynir','Az tuzlu olsun'),(69,59,2,2,45.00,'Ekstra Peynir','Az tuzlu olsun'),(70,60,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(71,60,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(72,60,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(73,60,4,2,69.90,'Ekstra Peynir','Az tuzlu olsun'),(74,60,4,3,69.90,'Ekstra Peynir','Az tuzlu olsun'),(75,60,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(76,60,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(77,60,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(78,61,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(79,62,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(80,63,4,6,69.90,'Ekstra Peynir','Az tuzlu olsun'),(81,64,2,1,45.00,'Ekstra Peynir','Az tuzlu olsun'),(82,65,2,2,45.00,'Ekstra Peynir','Az tuzlu olsun'),(83,66,2,16,45.00,'Ekstra Peynir','Az tuzlu olsun'),(84,67,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(85,68,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(86,69,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(87,70,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(88,71,2,4,45.00,'Ekstra Peynir','Az tuzlu olsun'),(89,72,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(90,73,4,2,69.90,'Ekstra Peynir','Az tuzlu olsun'),(91,74,2,3,45.00,'Ekstra Peynir','Az tuzlu olsun'),(92,75,2,1,300.00,'Orta Boy','Az tuzlu olsun'),(93,75,5,1,111.00,'Büyük Boy','Az tuzlu olsun'),(94,76,2,3,300.00,'Orta Boy','Az tuzlu olsun'),(95,77,6,3,123.00,'Büyük Boy','Az tuzlu olsun'),(96,78,6,1,123.00,'Büyük Boy','Az tuzlu olsun'),(97,78,8,1,565.00,'buyuk','Az tuzlu olsun'),(98,79,8,1,565.00,'buyuk','Az tuzlu olsun'),(99,80,6,1,123.00,'Orta Boy','Az tuzlu olsun'),(100,81,12,1,3.00,'Orta Boy','Az tuzlu olsun'),(101,82,6,1,123.00,'Orta Boy','Az tuzlu olsun'),(102,83,12,1,3.00,'Orta Boy','Az tuzlu olsun'),(103,83,13,7,22.00,'Büyük Boy','Az tuzlu olsun'),(104,83,12,1,3.00,'Orta Boy','Az tuzlu olsun'),(105,84,14,2,111.00,'Orta Boy','Az tuzlu olsun'),(106,85,15,1,10.00,'Büyük Boy','Az tuzlu olsun'),(107,86,15,1,10.00,'Orta Boy','Az tuzlu olsun'),(108,87,15,1,10.00,'Büyük Boy','Az tuzlu olsun'),(109,88,15,1,10.00,'Büyük Boy','Az tuzlu olsun'),(110,88,15,1,10.00,'Orta Boy','Az tuzlu olsun'),(111,88,15,7,10.00,'Büyük Boy','Az tuzlu olsun'),(112,89,15,1,10.00,'Orta Boy','Az tuzlu olsun'),(113,89,15,6,10.00,'Orta Boy','Az tuzlu olsun'),(114,89,15,1,10.00,'Orta Boy','Az tuzlu olsun'),(115,89,16,4,11.00,'Orta Boy','Az tuzlu olsun'),(116,89,25,1,22.00,'Orta Boy','Az tuzlu olsun'),(117,90,26,4,100.00,'Büyük Boy','Az tuzlu olsun'),(118,90,27,1,50.00,'Orta Boy','Az tuzlu olsun'),(119,90,26,3,100.00,'Büyük Boy','Az tuzlu olsun'),(120,91,26,1,100.00,'Orta Boy','Az tuzlu olsun'),(121,91,26,1,100.00,'Orta Boy','Az tuzlu olsun'),(122,91,26,1,100.00,'Orta Boy','Az tuzlu olsun'),(123,91,26,2,100.00,'Orta Boy','Az tuzlu olsun'),(124,91,57,1,130.00,'Büyük Boy','Az tuzlu olsun'),(125,91,57,1,130.00,'Büyük Boy','Az tuzlu olsun'),(126,91,69,1,5.00,'Orta Boy','Az tuzlu olsun'),(127,91,58,1,60.00,'Büyük Boy','Az tuzlu olsun'),(128,92,28,3,100.00,'Orta Boy','Az tuzlu olsun'),(129,93,26,2,100.00,'Orta Boy','Az tuzlu olsun'),(130,94,60,1,20.00,'Orta Boy','Az tuzlu olsun'),(131,95,58,3,60.00,'Orta Boy','Az tuzlu olsun'),(132,96,26,2,100.00,'Orta Boy','Az tuzlu olsun'),(133,96,26,1,100.00,'Orta Boy','Az tuzlu olsun'),(134,96,60,1,20.00,'Orta Boy','Az tuzlu olsun'),(135,97,72,1,40.00,'Orta Boy','Az tuzlu olsun');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `old_status` enum('pending','preparing','on_the_way','delivered','cancelled') DEFAULT NULL,
  `new_status` enum('pending','preparing','on_the_way','delivered','cancelled') NOT NULL,
  `changed_at` datetime DEFAULT current_timestamp(),
  `staff_id` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_status_history_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (1,4,NULL,'pending','2025-03-30 11:30:22',NULL,'Sipariş oluşturuldu'),(2,5,NULL,'pending','2025-03-30 11:47:56',NULL,'Sipariş oluşturuldu'),(3,6,NULL,'pending','2025-03-30 11:50:38',NULL,'Sipariş oluşturuldu'),(4,7,NULL,'pending','2025-03-30 11:52:12',NULL,'Sipariş oluşturuldu'),(5,8,NULL,'pending','2025-03-30 11:54:42',NULL,'Sipariş oluşturuldu'),(6,9,NULL,'pending','2025-03-30 12:06:13',NULL,'Sipariş oluşturuldu'),(7,10,NULL,'pending','2025-03-30 12:06:31',NULL,'Sipariş oluşturuldu'),(8,11,NULL,'pending','2025-03-30 12:07:28',NULL,'Sipariş oluşturuldu'),(9,12,NULL,'pending','2025-03-30 12:11:49',NULL,'Sipariş oluşturuldu'),(10,13,NULL,'pending','2025-03-30 12:13:42',NULL,'Sipariş oluşturuldu'),(11,14,NULL,'pending','2025-03-30 12:17:00',NULL,'Sipariş oluşturuldu'),(12,15,NULL,'pending','2025-03-30 12:22:08',NULL,'Sipariş oluşturuldu'),(13,16,NULL,'pending','2025-03-30 12:24:22',NULL,'Sipariş oluşturuldu'),(14,17,NULL,'pending','2025-03-30 12:24:58',NULL,'Sipariş oluşturuldu'),(15,18,NULL,'pending','2025-03-30 12:33:19',NULL,'Sipariş oluşturuldu'),(16,19,NULL,'pending','2025-03-30 12:34:25',NULL,'Sipariş oluşturuldu'),(17,20,NULL,'pending','2025-03-30 12:37:46',NULL,'Sipariş oluşturuldu'),(18,21,NULL,'pending','2025-03-30 12:41:51',NULL,'Sipariş oluşturuldu'),(19,22,NULL,'pending','2025-03-30 12:44:37',NULL,'Sipariş oluşturuldu'),(20,23,NULL,'pending','2025-03-30 12:45:19',NULL,'Sipariş oluşturuldu'),(21,24,NULL,'pending','2025-03-30 12:47:18',NULL,'Sipariş oluşturuldu'),(22,25,NULL,'pending','2025-03-30 12:48:28',NULL,'Sipariş oluşturuldu'),(23,26,NULL,'pending','2025-03-30 12:51:10',NULL,'Sipariş oluşturuldu'),(24,27,NULL,'pending','2025-03-30 12:53:07',NULL,'Sipariş oluşturuldu'),(25,28,NULL,'pending','2025-03-30 12:55:29',NULL,'Sipariş oluşturuldu'),(26,29,NULL,'pending','2025-03-30 12:57:01',NULL,'Sipariş oluşturuldu'),(27,30,NULL,'pending','2025-03-30 12:59:03',NULL,'Sipariş oluşturuldu'),(28,31,NULL,'pending','2025-03-30 13:00:13',NULL,'Sipariş oluşturuldu'),(29,32,NULL,'pending','2025-03-30 13:19:36',NULL,'Sipariş oluşturuldu'),(30,33,NULL,'pending','2025-03-30 13:26:04',NULL,'Sipariş oluşturuldu'),(31,34,NULL,'pending','2025-03-30 13:27:18',NULL,'Sipariş oluşturuldu'),(32,35,NULL,'pending','2025-03-30 13:28:09',NULL,'Sipariş oluşturuldu'),(33,36,NULL,'pending','2025-03-30 13:30:36',NULL,'Sipariş oluşturuldu'),(34,37,NULL,'pending','2025-03-30 13:42:49',NULL,'Sipariş oluşturuldu'),(35,38,NULL,'pending','2025-03-30 13:46:12',NULL,'Sipariş oluşturuldu'),(36,39,NULL,'pending','2025-03-30 13:48:34',NULL,'Sipariş oluşturuldu'),(37,40,NULL,'pending','2025-03-30 13:50:06',NULL,'Sipariş oluşturuldu'),(38,41,NULL,'pending','2025-03-30 14:01:22',NULL,'Sipariş oluşturuldu'),(39,42,NULL,'pending','2025-03-30 14:05:44',NULL,'Sipariş oluşturuldu'),(40,43,NULL,'pending','2025-03-30 14:06:09',NULL,'Sipariş oluşturuldu'),(41,44,NULL,'pending','2025-03-30 14:08:10',NULL,'Sipariş oluşturuldu'),(42,45,NULL,'pending','2025-03-30 14:08:36',NULL,'Sipariş oluşturuldu'),(43,46,NULL,'pending','2025-03-30 15:15:12',NULL,'Sipariş oluşturuldu'),(44,47,NULL,'pending','2025-03-30 15:46:37',NULL,'Sipariş oluşturuldu'),(45,48,NULL,'pending','2025-03-30 15:48:18',NULL,'Sipariş oluşturuldu'),(46,49,NULL,'pending','2025-03-30 16:15:02',NULL,'Sipariş oluşturuldu'),(47,50,NULL,'pending','2025-03-30 16:17:16',NULL,'Sipariş oluşturuldu'),(48,51,NULL,'pending','2025-03-30 16:41:00',NULL,'Sipariş oluşturuldu'),(49,52,NULL,'pending','2025-03-30 17:27:03',NULL,'Sipariş oluşturuldu'),(50,53,NULL,'pending','2025-03-30 17:32:51',NULL,'Sipariş oluşturuldu'),(51,54,NULL,'pending','2025-03-30 17:41:29',NULL,'Sipariş oluşturuldu'),(52,55,NULL,'pending','2025-03-30 17:49:55',NULL,'Sipariş oluşturuldu'),(53,56,NULL,'pending','2025-03-30 18:06:06',NULL,'Sipariş oluşturuldu'),(54,57,NULL,'pending','2025-03-30 18:32:53',NULL,'Sipariş oluşturuldu'),(55,58,NULL,'pending','2025-03-30 18:34:11',NULL,'Sipariş oluşturuldu'),(56,59,NULL,'pending','2025-03-30 18:43:41',NULL,'Sipariş oluşturuldu'),(57,60,NULL,'pending','2025-03-30 19:21:07',NULL,'Sipariş oluşturuldu'),(58,61,NULL,'pending','2025-03-30 20:44:33',NULL,'Sipariş oluşturuldu'),(59,62,NULL,'pending','2025-03-30 20:53:51',NULL,'Sipariş oluşturuldu'),(60,63,NULL,'pending','2025-03-30 21:02:46',NULL,'Sipariş oluşturuldu'),(61,64,NULL,'pending','2025-03-31 14:51:59',NULL,'Sipariş oluşturuldu'),(62,65,NULL,'pending','2025-03-31 15:31:20',NULL,'Sipariş oluşturuldu'),(63,66,NULL,'pending','2025-03-31 16:06:10',NULL,'Sipariş oluşturuldu'),(64,67,NULL,'pending','2025-03-31 17:10:22',NULL,'Sipariş oluşturuldu'),(65,68,NULL,'pending','2025-04-06 14:09:41',NULL,'Sipariş oluşturuldu'),(66,69,NULL,'pending','2025-04-06 18:05:25',NULL,'Sipariş oluşturuldu'),(67,70,NULL,'pending','2025-04-06 18:08:45',NULL,'Sipariş oluşturuldu'),(68,71,NULL,'pending','2025-04-06 18:20:09',NULL,'Sipariş oluşturuldu'),(69,72,NULL,'pending','2025-04-06 18:23:17',NULL,'Sipariş oluşturuldu'),(70,73,NULL,'pending','2025-04-09 10:43:31',NULL,'Sipariş oluşturuldu'),(71,74,NULL,'pending','2025-04-16 14:02:03',NULL,'Sipariş oluşturuldu'),(72,75,NULL,'pending','2025-04-16 14:07:59',NULL,'Sipariş oluşturuldu'),(73,76,NULL,'pending','2025-04-16 14:20:41',NULL,'Sipariş oluşturuldu'),(74,77,NULL,'pending','2025-04-30 16:01:02',NULL,'Sipariş oluşturuldu'),(75,78,NULL,'pending','2025-04-30 16:16:14',NULL,'Sipariş oluşturuldu'),(76,79,NULL,'pending','2025-04-30 16:16:30',NULL,'Sipariş oluşturuldu'),(77,80,NULL,'pending','2025-04-30 16:42:23',NULL,'Sipariş oluşturuldu'),(78,81,NULL,'pending','2025-04-30 17:01:54',NULL,'Sipariş oluşturuldu'),(79,82,NULL,'pending','2025-05-04 17:18:48',NULL,'Sipariş oluşturuldu'),(80,82,'pending','preparing','2025-05-05 21:54:37',3,'Durum güncellendi'),(81,79,'pending','on_the_way','2025-05-05 21:54:48',3,'Durum güncellendi'),(82,78,'pending','cancelled','2025-05-05 21:55:07',3,'Durum güncellendi'),(83,82,'preparing','pending','2025-05-05 22:03:01',3,'Durum güncellendi'),(84,82,'pending','preparing','2025-05-05 22:03:06',3,'Durum güncellendi'),(85,81,'pending','delivered','2025-05-05 22:08:09',3,'Durum güncellendi'),(86,82,'preparing','pending','2025-05-05 22:18:20',3,'Durum güncellendi'),(87,82,'pending','preparing','2025-05-07 00:15:15',3,'Durum güncellendi'),(88,81,'delivered','on_the_way','2025-05-08 17:46:55',3,'Durum güncellendi'),(89,81,'on_the_way','cancelled','2025-05-08 17:47:09',3,'Durum güncellendi'),(90,82,'preparing','on_the_way','2025-05-08 18:49:36',3,'Durum güncellendi'),(91,82,'on_the_way','preparing','2025-05-08 18:55:51',3,'Durum güncellendi'),(92,83,NULL,'pending','2025-05-08 19:03:39',NULL,'Sipariş oluşturuldu'),(93,84,NULL,'pending','2025-05-09 20:19:49',NULL,'Sipariş oluşturuldu'),(94,84,'pending','delivered','2025-05-12 07:27:49',3,'Durum güncellendi'),(95,85,NULL,'pending','2025-05-12 07:47:51',NULL,'Sipariş oluşturuldu'),(96,86,NULL,'pending','2025-05-12 08:33:52',NULL,'Sipariş oluşturuldu'),(97,87,NULL,'pending','2025-05-12 09:28:36',NULL,'Sipariş oluşturuldu'),(98,88,NULL,'pending','2025-05-12 11:14:50',NULL,'Sipariş oluşturuldu'),(99,89,NULL,'pending','2025-05-12 14:32:09',NULL,'Sipariş oluşturuldu'),(100,89,'pending','preparing','2025-05-12 14:32:58',3,'Durum güncellendi'),(101,89,'preparing','on_the_way','2025-05-12 14:33:02',3,'Durum güncellendi'),(102,89,'on_the_way','delivered','2025-05-12 14:33:05',3,'Durum güncellendi'),(103,88,'pending','on_the_way','2025-05-13 17:42:25',3,'Durum güncellendi'),(104,88,'on_the_way','cancelled','2025-05-14 08:08:33',3,'Durum güncellendi'),(105,90,NULL,'pending','2025-05-14 13:45:06',NULL,'Sipariş oluşturuldu'),(106,91,NULL,'pending','2025-05-14 14:29:32',NULL,'Sipariş oluşturuldu'),(107,92,NULL,'pending','2025-05-15 14:08:55',NULL,'Sipariş oluşturuldu'),(108,93,NULL,'pending','2025-05-16 10:42:15',NULL,'Sipariş oluşturuldu'),(109,94,NULL,'pending','2025-05-16 12:12:11',NULL,'Sipariş oluşturuldu'),(110,95,NULL,'pending','2025-05-16 14:02:47',NULL,'Sipariş oluşturuldu'),(111,96,NULL,'pending','2025-07-04 08:25:20',NULL,'Sipariş oluşturuldu'),(112,96,'pending','cancelled','2025-07-04 08:30:30',3,'Durum güncellendi'),(113,97,NULL,'pending','2025-07-04 17:14:39',NULL,'Sipariş oluşturuldu');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` enum('registered','guest') DEFAULT 'registered',
  `address_id` int(11) NOT NULL,
  `order_time` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `payment_type` enum('cash','credit_card') NOT NULL,
  `order_status` enum('pending','preparing','on_the_way','delivered','cancelled') DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  KEY `fk_orders_guest` (`guest_id`),
  KEY `fk_order_updated_by` (`updated_by`),
  CONSTRAINT `fk_order_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_guest` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (4,56,'registered',57,'2025-03-30 11:30:22',159.90,'cash','preparing',NULL,NULL,NULL,NULL,NULL),(5,56,'registered',57,'2025-03-30 11:47:56',450.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(6,56,'registered',57,'2025-03-30 11:50:38',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(7,56,'registered',57,'2025-03-30 11:52:12',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(8,56,'registered',57,'2025-03-30 11:54:42',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(9,56,'registered',57,'2025-03-30 12:06:13',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(10,56,'registered',57,'2025-03-30 12:06:31',69.90,'cash','pending',NULL,NULL,NULL,NULL,NULL),(11,56,'registered',57,'2025-03-30 12:07:28',69.90,'cash','pending',NULL,NULL,NULL,NULL,NULL),(12,56,'registered',57,'2025-03-30 12:11:49',500.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(13,56,'registered',57,'2025-03-30 12:13:42',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(14,56,'registered',57,'2025-03-30 12:17:00',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(15,56,'registered',57,'2025-03-30 12:22:08',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(16,56,'registered',57,'2025-03-30 12:24:22',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(17,56,'registered',57,'2025-03-30 12:24:58',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(18,56,'registered',57,'2025-03-30 12:33:19',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(19,56,'registered',57,'2025-03-30 12:34:25',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(20,56,'registered',57,'2025-03-30 12:37:46',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(21,56,'registered',57,'2025-03-30 12:41:51',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(22,56,'registered',57,'2025-03-30 12:44:37',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(23,56,'registered',57,'2025-03-30 12:45:19',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(24,56,'registered',57,'2025-03-30 12:47:18',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(25,56,'registered',57,'2025-03-30 12:48:28',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(26,56,'registered',57,'2025-03-30 12:51:10',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(27,56,'registered',57,'2025-03-30 12:53:07',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(28,56,'registered',57,'2025-03-30 12:55:29',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(29,56,'registered',57,'2025-03-30 12:57:01',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(30,56,'registered',57,'2025-03-30 12:59:03',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(31,56,'registered',57,'2025-03-30 13:00:13',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(32,56,'registered',57,'2025-03-30 13:19:36',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(33,56,'registered',57,'2025-03-30 13:26:04',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(34,56,'registered',57,'2025-03-30 13:27:18',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(35,56,'registered',57,'2025-03-30 13:28:09',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(36,56,'registered',57,'2025-03-30 13:30:36',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(37,56,'registered',57,'2025-03-30 13:42:49',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(38,56,'registered',57,'2025-03-30 13:46:12',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(39,56,'registered',57,'2025-03-30 13:48:34',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(40,56,'registered',57,'2025-03-30 13:50:06',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(41,56,'registered',57,'2025-03-30 14:01:22',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(42,56,'registered',57,'2025-03-30 14:05:44',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(43,56,'registered',57,'2025-03-30 14:06:09',45.00,'credit_card','pending',NULL,NULL,NULL,NULL,NULL),(44,56,'registered',57,'2025-03-30 14:08:10',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(45,56,'registered',57,'2025-03-30 14:08:36',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(46,56,'registered',57,'2025-03-30 15:15:12',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(47,56,'registered',57,'2025-03-30 15:46:37',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(48,56,'registered',57,'2025-03-30 15:48:18',45.00,'cash','pending','Lütfen soğan olmasın',NULL,NULL,NULL,NULL),(49,56,'registered',57,'2025-03-30 16:15:02',294.90,'cash','pending',NULL,NULL,NULL,NULL,NULL),(50,56,'registered',57,'2025-03-30 16:17:16',45.00,'credit_card','on_the_way',NULL,NULL,NULL,NULL,NULL),(51,56,'registered',57,'2025-03-30 16:41:00',344.70,'cash','pending',NULL,NULL,NULL,NULL,NULL),(52,56,'registered',58,'2025-03-30 17:27:03',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(53,56,'registered',57,'2025-03-30 17:32:51',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(54,56,'registered',58,'2025-03-30 17:41:29',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(55,56,'registered',57,'2025-03-30 17:49:55',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(56,56,'registered',60,'2025-03-30 18:06:06',90.00,'cash','pending','Sjdjsksbdb',NULL,NULL,NULL,NULL),(57,85,'registered',61,'2025-03-30 18:32:53',360.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(58,85,'registered',61,'2025-03-30 18:34:11',180.00,'credit_card','pending','Dhdjdks',NULL,NULL,NULL,NULL),(59,86,'registered',62,'2025-03-30 18:43:41',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(60,85,'registered',61,'2025-03-30 19:21:07',799.50,'cash','pending',NULL,NULL,NULL,NULL,NULL),(61,92,'registered',65,'2025-03-30 20:44:33',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(62,93,'registered',66,'2025-03-30 20:53:51',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(63,94,'registered',67,'2025-03-30 21:02:46',419.40,'cash','pending',NULL,NULL,NULL,NULL,NULL),(64,85,'registered',61,'2025-03-31 14:51:59',45.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(65,96,'registered',68,'2025-03-31 15:31:20',90.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(66,85,'registered',61,'2025-03-31 16:06:10',720.00,'credit_card','pending','Test',NULL,NULL,NULL,NULL),(67,85,'registered',61,'2025-03-31 17:10:22',135.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(68,85,'registered',61,'2025-04-06 14:09:41',135.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(69,85,'registered',61,'2025-04-06 18:05:25',135.00,'credit_card','pending',NULL,NULL,NULL,NULL,NULL),(70,101,'registered',69,'2025-04-06 18:08:45',135.00,'cash','pending','Tuzlu',NULL,NULL,NULL,NULL),(71,102,'registered',70,'2025-04-06 18:20:09',180.00,'cash','pending','Jdjdslsjsgdş',NULL,NULL,NULL,NULL),(72,85,'registered',61,'2025-04-06 18:23:17',135.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(73,85,'registered',61,'2025-04-09 10:43:31',139.80,'credit_card','pending',NULL,NULL,NULL,NULL,NULL),(74,85,'registered',61,'2025-04-16 14:02:03',135.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(75,85,'registered',61,'2025-04-16 14:07:59',411.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(76,85,'registered',61,'2025-04-16 14:20:41',900.00,'credit_card','pending','Dnbfslsl',NULL,NULL,NULL,NULL),(77,85,'registered',61,'2025-04-30 16:01:02',369.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(78,85,'registered',61,'2025-04-30 16:16:14',688.00,'cash','cancelled',NULL,NULL,NULL,NULL,NULL),(79,85,'registered',61,'2025-04-30 16:16:30',565.00,'cash','on_the_way',NULL,NULL,NULL,NULL,NULL),(80,85,'registered',61,'2025-04-30 16:42:23',123.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(81,85,'registered',61,'2025-04-30 17:01:54',3.00,'cash','cancelled',NULL,NULL,NULL,NULL,NULL),(82,105,'registered',74,'2025-05-04 17:18:48',123.00,'cash','preparing',NULL,NULL,NULL,NULL,NULL),(83,85,'registered',61,'2025-05-08 19:03:39',160.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(84,85,'registered',76,'2025-05-09 20:19:49',222.00,'cash','delivered','Shş',NULL,NULL,NULL,NULL),(85,85,'registered',76,'2025-05-12 07:47:51',10.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(86,85,'registered',76,'2025-05-12 08:33:52',10.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(87,85,'registered',76,'2025-05-12 09:28:36',10.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(88,85,'registered',76,'2025-05-12 11:14:50',90.00,'credit_card','cancelled','Rest',NULL,NULL,NULL,NULL),(89,85,'registered',78,'2025-05-12 14:32:09',146.00,'cash','delivered',NULL,NULL,NULL,NULL,NULL),(90,85,'registered',78,'2025-05-14 13:45:06',750.00,'credit_card','pending','Soğansız',NULL,NULL,NULL,NULL),(91,85,'registered',78,'2025-05-14 14:29:32',825.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(92,85,'registered',79,'2025-05-15 14:08:55',300.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(93,85,'registered',79,'2025-05-16 10:42:15',200.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(94,85,'registered',79,'2025-05-16 12:12:11',20.00,'credit_card','pending',NULL,NULL,NULL,NULL,NULL),(95,85,'registered',79,'2025-05-16 14:02:47',180.00,'cash','pending',NULL,NULL,NULL,NULL,NULL),(96,108,'registered',85,'2025-07-04 08:25:20',320.00,'credit_card','cancelled',NULL,NULL,NULL,NULL,NULL),(97,108,'registered',85,'2025-07-04 17:14:39',40.00,'credit_card','pending',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ingredients`)),
  `is_active` tinyint(1) DEFAULT 1,
  `category_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'Cheese Burger','Lezzetli bir cheese burger',300.00,'/uploads/1744801491123-365347227.png','[]','[]',0,1,'2025-03-24 16:50:22','2025-04-21 17:09:20'),(4,'Margarita Pizza','Domates sosu, mozzarella peyniri ve fesleğen yaprakları ile hazırlanan klasik İtalyan pizzası',69.90,NULL,'[{\"name\":\"Ekstra Peynir\",\"price_modifier\":5}]','[\"peynir\",\"domates sosu\",\"fesleğen\"]',0,4,'2025-03-29 10:46:15','2025-04-21 17:10:03'),(5,'döner agaga','abhahh',112.00,'/uploads/1745244704305-263646659.png','[]','[]',0,7,'2025-04-16 14:06:21','2025-04-21 17:14:45'),(6,'test2','agag',123.00,NULL,'[]','[]',0,5,'2025-04-16 14:09:48','2025-05-12 07:00:55'),(7,'test','',1111.00,NULL,'[]','[]',0,5,'2025-04-16 14:11:49','2025-05-12 07:00:57'),(8,'iskender','çok lezzetli',555.00,'/uploads/1745245043611-21635366.jpg','[{\"name\":\"buyuk\",\"is_default\":false,\"priceModifier\":10},{\"name\":\"kucuk\",\"is_default\":false,\"priceModifier\":5}]','[]',0,7,'2025-04-21 17:17:23','2025-05-12 07:00:58'),(9,'iskender','çok lezzetli',555.00,'/uploads/1745245044520-839877197.jpg','[{\"name\":\"buyuk\",\"is_default\":false,\"priceModifier\":10},{\"name\":\"kucuk\",\"is_default\":false,\"priceModifier\":5}]','[]',0,7,'2025-04-21 17:17:24','2025-05-12 07:00:59'),(10,'Cheese Burger','Lezzetli bir cheese burger',300.00,'/uploads/1744801491123-365347227.png','[]','[]',0,1,'2025-03-24 16:50:22','2025-04-21 17:09:20'),(11,'Cheese Burger','Lezzetli bir cheese burger',300.00,'/uploads/1744801491123-365347227.png','[]','[]',0,1,'2025-03-24 16:50:22','2025-04-21 17:09:20'),(12,'test',NULL,3.00,NULL,'[]','[]',0,1,'2025-04-30 16:57:47','2025-05-12 07:01:01'),(13,'test3','ff',22.00,'/uploads/1746021512500-840869790.jpeg','[]','[]',0,5,'2025-04-30 16:58:32','2025-05-12 07:01:02'),(14,'tetts',NULL,111.00,'/uploads/1746820026588-917078596.jpg','[]','[]',0,4,'2025-05-09 19:47:06','2025-05-12 07:01:04'),(15,'test','test',10.00,'/uploads/1747034721670-754170992.png','[]','[]',0,8,'2025-05-12 07:25:21','2025-05-12 14:28:51'),(16,'test','test',11.00,NULL,'[]','[]',0,8,'2025-05-12 12:09:24','2025-05-13 11:47:24'),(17,'test','1241',1223.00,NULL,'[]','[]',0,8,'2025-05-12 12:09:37','2025-05-13 11:47:26'),(18,'test','1241',1223.00,NULL,'[]','[]',0,8,'2025-05-12 12:09:37','2025-05-13 11:47:28'),(19,'test','1241',1223.00,NULL,'[]','[]',0,8,'2025-05-12 12:09:38','2025-05-13 11:47:29'),(20,'test','1241',1223.00,NULL,'[]','[]',0,8,'2025-05-12 12:09:38','2025-05-13 11:47:31'),(21,'test','1241',1223.00,NULL,'[]','[]',0,8,'2025-05-12 12:09:39','2025-05-13 11:47:32'),(22,'rwar','1',111.00,'/uploads/1747058878680-180945714.jpg','[]','[]',0,8,'2025-05-12 14:07:58','2025-05-13 11:47:35'),(23,'test111','test',1.00,'/uploads/1747059030353-810451005.jpeg','[]','[]',0,8,'2025-05-12 14:10:30','2025-05-13 11:47:36'),(24,'tesss111','1',1.00,'/uploads/1747059350538-28093331.jpeg','[]','[]',0,8,'2025-05-12 14:15:50','2025-05-13 11:47:38'),(25,'22','22',22.00,'/uploads/1747059576767-345820796.jpeg','[]','[]',0,5,'2025-05-12 14:19:36','2025-05-13 11:47:39'),(26,'TAM DÖNER','',100.00,'/uploads/1747380930838-660237607.png','[]','[]',1,5,'2025-05-13 11:49:44','2025-05-21 16:35:53'),(27,'YARIM DÖNER','',50.00,'/uploads/1747382998057-471627966.jpg','[]','[]',1,5,'2025-05-13 14:24:17','2025-05-17 05:53:10'),(28,'TAM KÖFTE ','',100.00,'/uploads/1747296199877-288726180.jpg','[]','[]',1,5,'2025-05-13 17:07:30','2025-05-15 08:03:19'),(29,'YARIM KÖFTE','',50.00,'/uploads/1747295830340-89227256.jpg','[]','[]',1,5,'2025-05-13 17:07:47','2025-05-15 07:57:10'),(30,'YARIM KÖFTE',NULL,50.00,NULL,'[]','[]',0,5,'2025-05-13 17:07:49','2025-05-13 17:07:54'),(31,'ÇİFT LAVAŞ DÖNER','',110.00,'/uploads/1747381159492-633478872.png','[]','[]',1,5,'2025-05-13 17:09:51','2025-05-16 07:39:19'),(32,'YARIM ÇİFT LAVAŞ DÖNER','',60.00,'/uploads/1747380770110-577142510.jpg','[]','[]',1,5,'2025-05-13 17:11:14','2025-05-16 07:32:50'),(33,'KÖFTE DÖNER SOMUN','',110.00,'/uploads/1747296389958-999151120.jpg','[]','[]',1,5,'2025-05-13 17:12:11','2025-05-15 08:06:29'),(34,'YARIM KÖFTE DÖNER SOMUN','',60.00,'/uploads/1747381389376-227656387.jpg','[]','[]',1,5,'2025-05-13 17:13:00','2025-05-16 07:43:09'),(35,'TAM SOMUN','',100.00,'/uploads/1747295947722-154961578.jpg','[]','[]',1,5,'2025-05-13 17:13:43','2025-05-15 07:59:07'),(36,'TAM SOMUN',NULL,100.00,NULL,'[]','[]',0,5,'2025-05-13 17:13:45','2025-05-13 17:14:49'),(37,'YARIM SOMUN','',50.00,'/uploads/1747296029594-732610397.jpg','[]','[]',1,5,'2025-05-13 17:14:05','2025-05-15 08:00:29'),(38,'YARIM SOMUN',NULL,50.00,NULL,'[]','[]',0,5,'2025-05-13 17:14:06','2025-05-13 17:16:10'),(39,'KÖFTE DÖNER LAVAŞ',NULL,110.00,NULL,'[]','[]',0,5,'2025-05-13 17:14:33','2025-05-13 17:16:12'),(40,'KÖFTE DÖNER LAVAŞ','',110.00,'/uploads/1747382781503-55044480.png','[]','[]',1,5,'2025-05-13 17:15:39','2025-05-16 08:06:21'),(41,'KÖFTE DÖNER YARIM LAVAŞ','',60.00,'/uploads/1747382890480-750395754.jpg','[]','[]',1,5,'2025-05-13 17:16:40','2025-05-16 08:08:10'),(42,'KÖTFE LAVAŞ','',100.00,'/uploads/1747382234670-753422842.jpg','[]','[]',1,5,'2025-05-13 17:17:43','2025-05-16 07:57:14'),(43,'KÖTFE LAVAŞ',NULL,100.00,NULL,'[]','[]',0,5,'2025-05-13 17:17:45','2025-05-13 17:18:33'),(44,'YARIM KÖFTE LAVAŞ','',50.00,'/uploads/1747382434951-606715086.jpg','[]','[]',1,5,'2025-05-13 17:19:36','2025-05-16 08:00:34'),(45,'YARIM KÖFTE LAVAŞ',NULL,50.00,NULL,'[]','[]',0,5,'2025-05-13 17:19:38','2025-05-13 17:20:26'),(46,'ÇİFT LAVAŞ KÖFTE','',110.00,'/uploads/1747383446147-230659784.jpg','[]','[]',1,5,'2025-05-13 17:20:11','2025-05-16 08:17:26'),(47,'ÇİFT LAVAŞ KÖFTE',NULL,110.00,NULL,'[]','[]',0,5,'2025-05-13 17:20:13','2025-05-13 17:20:22'),(48,'YARIM ÇİFT LAVAŞ KÖFTE','',60.00,'/uploads/1747383472071-894791791.jpg','[]','[]',1,5,'2025-05-13 17:21:16','2025-05-16 08:17:52'),(49,'ÇİFT LAVAŞ KÖFTE DÖNER','',120.00,'/uploads/1747383526011-746223880.jpg','[]','[]',1,5,'2025-05-13 17:22:24','2025-05-16 08:18:46'),(50,'YARIM ÇİFT LAVAŞ KÖFTE DÖNER','',70.00,'/uploads/1747383548308-928703608.jpg','[]','[]',1,5,'2025-05-13 17:23:00','2025-05-16 08:19:08'),(51,'YARIM ÇİFT LAVAŞKÖFTE DÖNER',NULL,70.00,NULL,'[]','[]',0,5,'2025-05-13 17:23:02','2025-05-13 17:23:14'),(52,'PORSİYON DÖNER','',120.00,'/uploads/1747381461890-66579482.jpg','[]','[]',1,5,'2025-05-13 17:24:29','2025-05-16 07:44:21'),(53,'PORSİYON KÖFTE DÖNER','',130.00,'/uploads/1747381598812-605260368.jpg','[]','[]',1,5,'2025-05-13 17:24:55','2025-05-16 07:46:38'),(54,'PORSİYON KÖFTE','',120.00,'/uploads/1747384070965-731756801.jpg','[]','[]',1,5,'2025-05-13 17:25:20','2025-05-16 08:27:50'),(55,'PİLAV ÜSTÜ DÖNER','',120.00,'/uploads/1747295691829-776162647.jpg','[]','[]',1,5,'2025-05-13 17:25:53','2025-05-15 07:54:51'),(56,'PİLAV ÜSTÜ KÖFTE','',120.00,'/uploads/1747384235789-109877415.jpg','[]','[]',1,5,'2025-05-13 17:26:22','2025-05-16 08:30:35'),(57,'PİLAV ÜSTÜ KÖFTE DÖNER','',130.00,'/uploads/1747384283560-790330344.jpg','[]','[]',1,5,'2025-05-13 17:26:45','2025-05-16 08:31:23'),(58,'YARIM ÇİFT LAVAŞ KÖFTE','',60.00,'/uploads/1747384324502-674553296.jpg','[]','[]',1,5,'2025-05-13 17:31:16','2025-05-16 08:32:04'),(59,'BÜYÜK AYRAN',NULL,20.00,NULL,'[]','[]',0,8,'2025-05-13 17:31:48','2025-05-14 08:04:29'),(60,'BÜYÜK AYRAN','',20.00,'/uploads/1747295505414-666768432.jpg','[]','[]',1,8,'2025-05-13 17:31:50','2025-05-15 07:51:45'),(61,'KÜÇÜK AYRAN','',10.00,'/uploads/1747295456789-856381911.jpg','[]','[]',1,8,'2025-05-13 17:32:25','2025-05-15 07:50:56'),(62,'AÇIK AYRAN','GÜNLÜK NANELİ',20.00,'/uploads/1747294579862-504974042.jpg','[]','[]',1,8,'2025-05-13 17:32:41','2025-05-15 07:37:02'),(63,'KUTU COCA COLA','330 ml',40.00,'/uploads/1747293267427-344631990.jpg','[]','[]',1,8,'2025-05-13 17:33:44','2025-06-20 20:01:33'),(64,'KUTU COLA TURKA 330ML','330  ML',40.00,'/uploads/1747293393159-298842458.jpg','[]','[]',1,8,'2025-05-13 17:34:01','2025-06-20 20:01:14'),(65,'1 LİTRE COCA COLA','',50.00,'/uploads/1747294194959-511680911.jpg','[]','[]',1,8,'2025-05-13 17:34:34','2025-06-20 19:59:31'),(66,'1 LİTRE COLA TURKA','',50.00,'/uploads/1747294269592-826920391.jpg','[]','[]',1,8,'2025-05-13 17:34:59','2025-06-20 20:00:05'),(67,'2,5 COCA COLA','',70.00,'/uploads/1747294130220-459329891.jpg','[]','[]',1,8,'2025-05-13 17:35:31','2025-05-15 07:28:50'),(68,'2,5 COLA TURKA','',70.00,'/uploads/1747294793280-918133260.jpg','[]','[]',1,8,'2025-05-13 17:35:51','2025-05-15 07:39:53'),(69,'SU','0,50 ML',10.00,'/uploads/1747295326402-105483184.jpg','[]','[]',1,8,'2025-05-13 17:36:04','2025-06-20 20:00:36'),(70,'1 LİTRE FANTA','',50.00,'/uploads/1747295150100-684233013.jpg','[]','[]',1,8,'2025-05-13 17:36:22','2025-06-20 19:58:52'),(71,'2,5 LİTRE FANTA','',70.00,'/uploads/1747295037568-885297255.jpg','[]','[]',1,8,'2025-05-13 17:36:42','2025-05-15 07:43:57'),(72,'KUTU FANTA','330 ML',40.00,'/uploads/1747814653263-61484067.jpeg','[]','[]',1,8,'2025-05-21 08:04:13','2025-06-20 20:00:55');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (2,'DİYARBAKIR ',1);
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_working_hours`
--

DROP TABLE IF EXISTS `restaurant_working_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurant_working_hours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day_of_week` tinyint(1) NOT NULL COMMENT '0=Pazar, 1=Pazartesi, 2=Salı, 3=Çarşamba, 4=Perşembe, 5=Cuma, 6=Cumartesi',
  `opening_time` time NOT NULL,
  `closing_time` time NOT NULL,
  `is_closed` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `day_of_week_unique` (`day_of_week`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_working_hours`
--

LOCK TABLES `restaurant_working_hours` WRITE;
/*!40000 ALTER TABLE `restaurant_working_hours` DISABLE KEYS */;
INSERT INTO `restaurant_working_hours` VALUES (1,0,'10:30:00','20:00:00',0,'2025-04-30 15:48:22','2025-05-17 05:54:57'),(2,1,'10:30:00','20:00:00',0,'2025-04-30 15:48:22','2025-05-17 05:54:49'),(3,2,'10:30:00','20:00:00',0,'2025-04-30 15:48:22','2025-05-17 05:55:16'),(4,3,'10:30:00','23:00:00',0,'2025-04-30 15:48:22','2025-05-21 19:25:05'),(5,4,'10:30:00','20:00:00',0,'2025-04-30 15:48:22','2025-05-17 05:55:34'),(6,5,'09:00:00','23:00:00',0,'2025-04-30 15:48:22','2025-07-04 08:20:54'),(7,6,'10:30:00','20:00:00',0,'2025-04-30 15:48:22','2025-05-17 05:56:02');
/*!40000 ALTER TABLE `restaurant_working_hours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `guest_id` (`guest_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (26,1,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZ2lzdGVyZWQiLCJpYXQiOjE3NDI4ODgyMjQsImV4cCI6MTc0Mjg5MTgyNH0.pn4u_VCSf7qsTglceu0ptxbXMVAvMWgY5lxKI6vCQ5A','2025-03-25 10:37:04','2025-03-25 11:37:04','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'),(27,1,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0Mjg5MDE5MSwiZXhwIjoxNzQ1NDgyMTkxfQ.5rde7H3qAWF-eNtHgl3542spT0GZwLbz-zNCfbIMOZM','2025-03-25 11:09:51','2025-04-24 11:09:51','okhttp/4.12.0'),(28,1,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0Mjg5MDIzMCwiZXhwIjoxNzQ1NDgyMjMwfQ.nO_sKHUiOT1WBpt54SSeTA_2JmmmrNXflYwbZt37VS0','2025-03-25 11:10:30','2025-04-24 11:10:30','okhttp/4.12.0'),(29,1,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0Mjg5MDM2MCwiZXhwIjoxNzQ1NDgyMzYwfQ.gSXzciaHURTnuLmiYU7ei4ywS-ZQMYH6zCn_nZ8PbMY','2025-03-25 11:12:40','2025-04-24 11:12:40','okhttp/4.12.0'),(30,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTExNTg1LCJleHAiOjE3NDI5MTUxODV9.M9Y7zJvif_tBtvOOrx8ccJjw-51zryk27iw-Q9a0pKM','2025-03-25 17:06:25','2025-03-25 18:06:25','okhttp/4.12.0'),(31,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTExNjc1LCJleHAiOjE3NDI5MTUyNzV9.nPs0DS9NCTpu84WJEj6kk9SmwHe9KQg1ZfVvnOCqNjg','2025-03-25 17:07:55','2025-03-25 18:07:55','okhttp/4.12.0'),(32,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTEzMDU5LCJleHAiOjE3NDI5MTY2NTl9.5hSXHIjRi40kqtps592bagZ4-tw6eys5TV0-0wzAKSI','2025-03-25 17:30:59','2025-03-25 18:30:59','okhttp/4.12.0'),(33,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTEzMTE2LCJleHAiOjE3NDI5MTY3MTZ9.8XCIiJ8o-2MamOu6DXO81CjoFnq-38ORUU0aBn1uyGI','2025-03-25 17:31:56','2025-03-25 18:31:56','okhttp/4.12.0'),(34,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTE0MTkxLCJleHAiOjE3NDI5MTc3OTF9.0m3mySIgMvdMxh6KleBedj0x0IYvPR0fHxKXCVs0nmQ','2025-03-25 17:49:51','2025-03-25 18:49:51','okhttp/4.12.0'),(35,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTE0MjIxLCJleHAiOjE3NDI5MTc4MjF9.K9VrtpiirT3gNbEaurg8ke16o9lyZFxplw49d1U611Y','2025-03-25 17:50:21','2025-03-25 18:50:21','okhttp/4.12.0'),(36,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTE0MjM5LCJleHAiOjE3NDI5MTc4Mzl9.AiWZ_SxQ1jZwQsCs4S3rGHdOkbH_tXxWU5h4W6WEM_k','2025-03-25 17:50:39','2025-03-25 18:50:39','okhttp/4.12.0'),(37,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTkyMzIxLCJleHAiOjE3NDI5OTU5MjF9.LRBzPQvfat33JNIFPNG3d_ZO8LDkmEUeX6W4w_GpDu0','2025-03-26 15:32:01','2025-03-26 16:32:01','okhttp/4.12.0'),(38,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTkyMzM5LCJleHAiOjE3NDI5OTU5Mzl9.4ihmk3LO1O2X8JbIdGzU3WHLj9PzlAX3KsuhoZfaxM4','2025-03-26 15:32:19','2025-03-26 16:32:19','okhttp/4.12.0'),(39,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTkzMDc0LCJleHAiOjE3NDI5OTY2NzR9.AblMe5jV8SEX8uikY9gps8U3uPTIhXEywQBc9Z3MN3g','2025-03-26 15:44:34','2025-03-26 16:44:34','okhttp/4.12.0'),(40,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTk2MzcwLCJleHAiOjE3NDI5OTk5NzB9.3DONKklR7zD9y1tO-_fvUP1onLeaoCM3s-z9UxT2DG4','2025-03-26 16:39:30','2025-03-26 17:39:30','okhttp/4.12.0'),(41,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTk3MTY3LCJleHAiOjE3NDMwMDA3Njd9.HMo6EuAXBVtoge02d4t50bxLnplJJV7in0gk7TGBmto','2025-03-26 16:52:47','2025-03-26 17:52:47','okhttp/4.12.0'),(42,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQyOTk3OTY4LCJleHAiOjE3NDMwMDE1Njh9.5Wda_vBAd3alBxlTCfmniNNfjOr7gDUH-lz5vxhVLiU','2025-03-26 17:06:08','2025-03-26 18:06:08','okhttp/4.12.0'),(43,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDc3NzE3LCJleHAiOjE3NDMwODEzMTd9.jVA1eI5Hj55suP_uJCNkGVC30DVIP2wwjPdMdjqBVPU','2025-03-27 15:15:17','2025-03-27 16:15:17','okhttp/4.12.0'),(44,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDc3NzkzLCJleHAiOjE3NDMwODEzOTN9.0BLMm_MHEw_bOpP3H8X0Y2bLiNtJAYqbnzU3amQLEUw','2025-03-27 15:16:33','2025-03-27 16:16:33','okhttp/4.12.0'),(45,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDc4NzQ5LCJleHAiOjE3NDMwODIzNDl9.f7B5Gyb_BtTUFdiWeMYzvZS896UWep3aHa9P-n6-rUg','2025-03-27 15:32:29','2025-03-27 16:32:29','okhttp/4.12.0'),(46,1,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZ2lzdGVyZWQiLCJpYXQiOjE3NDMwNzg4OTgsImV4cCI6MTc0MzA4MjQ5OH0.FU3e4B7ki_J8JYaoqILNyHpb8lNgkSq1NgWSeuaRYEY','2025-03-27 15:34:58','2025-03-27 16:34:58','okhttp/4.12.0'),(47,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDgxMjI5LCJleHAiOjE3NDMwODQ4Mjl9.3EW6_vSXnZiU244Q93si8oIyQRgldtHgHFLCNj3GaI8','2025-03-27 16:13:49','2025-03-27 17:13:49','okhttp/4.12.0'),(48,80,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODAsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDgzMzQ4LCJleHAiOjE3NDMwODY5NDh9.cITqjE-fwbl-bWxadpRQ25IlsqMaO2fRIDY5aBRPa0g','2025-03-27 16:49:08','2025-03-27 17:49:08','okhttp/4.12.0'),(49,81,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODEsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDgzOTI3LCJleHAiOjE3NDMwODc1Mjd9.IgUVXsA8UcQ1_Q83gAEfpLKWCudm2fOsDT5yym0qOW4','2025-03-27 16:58:47','2025-03-27 17:58:47','okhttp/4.12.0'),(50,82,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODIsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDkyMzMxLCJleHAiOjE3NDMwOTU5MzF9.nq8VX5tuA2gI6y87vh7a2swYrgtVV6LYUXgACA0Yvw4','2025-03-27 19:18:51','2025-03-27 20:18:51','okhttp/4.12.0'),(51,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDkyNzIxLCJleHAiOjE3NDMwOTYzMjF9.Z0eg6mrkODOGc0BkNC3kKZ1A4zFa1hdKwD0682W9ll8','2025-03-27 19:25:21','2025-03-27 20:25:21','okhttp/4.12.0'),(52,83,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODMsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDkyODU0LCJleHAiOjE3NDMwOTY0NTR9.3Jc4IIkfUtQD8qLT-h3ev9y_nNW7IJAt5cG6o3ck5rw','2025-03-27 19:27:34','2025-03-27 20:27:34','okhttp/4.12.0'),(53,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDkyODY3LCJleHAiOjE3NDMwOTY0Njd9.e1Q6p84nZU1f2guFX7aA8yhg9eHBcBWvrFnLHQqrujc','2025-03-27 19:27:47','2025-03-27 20:27:47','okhttp/4.12.0'),(54,83,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODMsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMDkyOTE3LCJleHAiOjE3NDMwOTY1MTd9.TuFMJ9Mom2kv0Wb9Y77DiIhguhjUIeG55rnu4oSJ7Ns','2025-03-27 19:28:37','2025-03-27 20:28:37','okhttp/4.12.0'),(55,83,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODMsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMTcxMDgyLCJleHAiOjE3NDMxNzQ2ODJ9.6kncZpi1Xd8tsABc7S4MiuequsuEzICESxd34Gbii8c','2025-03-28 17:11:22','2025-03-28 18:11:22','okhttp/4.12.0'),(56,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMTcxNDcwLCJleHAiOjE3NDMxNzUwNzB9.rKfsdv1UfHRP4ZMqgzx9z24_lVDzNPGiwXPcSEEkM1Y','2025-03-28 17:17:50','2025-03-28 18:17:50','okhttp/4.12.0'),(57,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMTcyMjE4LCJleHAiOjE3NDMxNzU4MTh9.B2k68el0tTPQwSUITtloqlik6jHZ09YUd1CbkELC7uY','2025-03-28 17:30:18','2025-03-28 18:30:18','okhttp/4.12.0'),(58,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMTcyNzYxLCJleHAiOjE3NDMxNzYzNjF9.gkI5TSPA_mH14uwWQCVOOHJCa2WSCkJpWTc2nC5wuJE','2025-03-28 17:39:21','2025-03-28 18:39:21','okhttp/4.12.0'),(59,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMTczMTM0LCJleHAiOjE3NDMxNzY3MzR9.aRkMcbCALDdNDZhg4W_jqaauiriI0slGihGXv4OGJsQ','2025-03-28 17:45:34','2025-03-28 18:45:34','okhttp/4.12.0'),(60,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjM0MzAzLCJleHAiOjE3NDMyMzc5MDN9.OIeNNIUiI-jgfVkB2_MoVRPZ_ewRsmt9qkmSm6vHHE4','2025-03-29 10:45:03','2025-03-29 11:45:03','okhttp/4.12.0'),(61,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjM4Njc5LCJleHAiOjE3NDMyNDIyNzl9.GiOa8CQTsi3eXiT3FwtQ6Fs3bcRfb5BTBgcqXm9FOpY','2025-03-29 11:57:59','2025-03-29 12:57:59','okhttp/4.12.0'),(62,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjM4ODI1LCJleHAiOjE3NDMyNDI0MjV9.ULXYJDLtSVfqVkkfCfAnvZ3MrQmj1bYM_McCWhXk0U8','2025-03-29 12:00:25','2025-03-29 13:00:25','okhttp/4.12.0'),(63,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjQyNTcxLCJleHAiOjE3NDMyNDYxNzF9.T4E4m2xVACEwJVeyr0hllwSih2Jp7DOEejvyXUXV3wQ','2025-03-29 13:02:51','2025-03-29 14:02:51','okhttp/4.12.0'),(64,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjQzMzI5LCJleHAiOjE3NDM4NDgxMjl9.HXDSJyidbW-uopRIFfL3uJTW7_FZpe54n8fFDiVfSyk','2025-03-29 13:15:29','2025-04-05 13:15:29','okhttp/4.12.0'),(65,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjQzNjM5LCJleHAiOjE3NDM4NDg0Mzl9.8VJVQEu3xuXQZSBnVuoeDcZExbwMBY0c1mNhjUhwiqo','2025-03-29 13:20:39','2025-04-05 13:20:39','okhttp/4.12.0'),(66,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjQ0MDE0LCJleHAiOjE3NDM4NDg4MTR9.swN-xG6j1TKA1N72Siq_1AaLQ8rRj6oQqMosUWAx2xA','2025-03-29 13:26:54','2025-04-05 13:26:54','okhttp/4.12.0'),(67,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMjQ0NTEyLCJleHAiOjE3NDM4NDkzMTJ9.mZCLm8SAywaE0IOjXSYzWpr9u3BdC6xQ-ACw3xalrFY','2025-03-29 13:35:12','2025-04-05 13:35:12','okhttp/4.12.0'),(68,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ2MjYyLCJleHAiOjE3NDM5NTEwNjJ9.9C3DhEeptVpHfH4fXIJXrHtBSWK4h1OMFZydmn0TF5M','2025-03-30 17:51:02','2025-04-06 17:51:02','okhttp/4.12.0'),(69,56,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ3MjAxLCJleHAiOjE3NDM5NTIwMDF9.doBCHWdC-PAbKj5bJCpkl-7p6v3KSN5KZZIITu77yRA','2025-03-30 18:06:41','2025-04-06 18:06:41','okhttp/4.12.0'),(70,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ4MjU3LCJleHAiOjE3NDM5NTMwNTd9.0TMS-1SEbc1em8VX4R1da1gnuKE1G59rZH12eFBdpXU','2025-03-30 18:24:17','2025-04-06 18:24:17','okhttp/4.12.0'),(71,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ4Mjk4LCJleHAiOjE3NDM5NTMwOTh9.tPoJxZDAQRFXIKk5lGqMy6-MIi3BUEzWURiHI0yTu-A','2025-03-30 18:24:58','2025-04-06 18:24:58','okhttp/4.12.0'),(72,86,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ4OTQ0LCJleHAiOjE3NDM5NTM3NDR9.1lZ8ZB0IIIuSCjRaepQv5ZSNcZ8m50sqslYl1ZdSi-s','2025-03-30 18:35:44','2025-04-06 18:35:44','okhttp/4.12.0'),(73,86,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ5MDI4LCJleHAiOjE3NDM5NTM4Mjh9.hw8bFqealiyXPyhRAmDTlqTagutYCdeR0aJJE7uYT9I','2025-03-30 18:37:08','2025-04-06 18:37:08','okhttp/4.12.0'),(74,87,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODcsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ5NTI1LCJleHAiOjE3NDM5NTQzMjV9.OzhdepRaXrEnFU4mLuO8LjXgKs-nde7jOdnJ7OK1VCU','2025-03-30 18:45:25','2025-04-06 18:45:25','okhttp/4.12.0'),(75,88,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ5NjY3LCJleHAiOjE3NDM5NTQ0Njd9.yZ3IPO12-SvPNcJycDl1x-grjRtxNif_PQK3YeWZRnk','2025-03-30 18:47:47','2025-04-06 18:47:47','okhttp/4.12.0'),(76,88,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzQ5NzI3LCJleHAiOjE3NDM5NTQ1Mjd9.RUay6rXujxftD1u40LbrlRJDplwvHX9csFRXa6mdybY','2025-03-30 18:48:47','2025-04-06 18:48:47','okhttp/4.12.0'),(77,89,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODksInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUwMjE2LCJleHAiOjE3NDM5NTUwMTZ9.UX74FE_jiS4h-bynh34OH7OJhK48V56QcsH2L5ma_wE','2025-03-30 18:56:56','2025-04-06 18:56:56','okhttp/4.12.0'),(78,90,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTAsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUwNTQzLCJleHAiOjE3NDM5NTUzNDN9.VCEZB40tnNEAcu64wSOiom_C1MsluVZMako1y3-ThBg','2025-03-30 19:02:23','2025-04-06 19:02:23','okhttp/4.12.0'),(79,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUwOTI1LCJleHAiOjE3NDM5NTU3MjV9.DvhxTqbjdSnDhnu_qgrVgrKT6MyK7VgJok00wpuFN-U','2025-03-30 19:08:45','2025-04-06 19:08:45','okhttp/4.12.0'),(80,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUxMDM4LCJleHAiOjE3NDM5NTU4Mzh9.6Nap0V1j1n9txvYa-KdRYRQTrp3Uchj6r2InXTJjzX8','2025-03-30 19:10:38','2025-04-06 19:10:38','okhttp/4.12.0'),(81,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUxNTQ5LCJleHAiOjE3NDM5NTYzNDl9.kMXFK-5G0iRlv-Pn6Bm92qbl6OEvYif5VlmwuHCgYuA','2025-03-30 19:19:09','2025-04-06 19:19:09','okhttp/4.12.0'),(82,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUxNTg0LCJleHAiOjE3NDM5NTYzODR9.2SiE7xO-xglD5qNKBMYn1TH7eEVDLjYYH3ne7SpSk7M','2025-03-30 19:19:44','2025-04-06 19:19:44','okhttp/4.12.0'),(83,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUxNjE1LCJleHAiOjE3NDM5NTY0MTV9.fv-WeqRZncroIDHo21kSwV3mVIKdB5j7OXXS9eUyQ7o','2025-03-30 19:20:15','2025-04-06 19:20:15','okhttp/4.12.0'),(84,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUyMTExLCJleHAiOjE3NDM5NTY5MTF9.ZPshuaMkA7X6Wr7qClv0_WKmUHFt588LwmcwKt_kb4I','2025-03-30 19:28:31','2025-04-06 19:28:31','okhttp/4.12.0'),(85,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUyMTM2LCJleHAiOjE3NDM5NTY5MzZ9.8PbkLiJ3GwMoli0MJC8tXDKH7HsdFEyRi0HAQrRc3G8','2025-03-30 19:28:56','2025-04-06 19:28:56','okhttp/4.12.0'),(86,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUyMTUwLCJleHAiOjE3NDM5NTY5NTB9.ir5wHIc8nhWw9_MbNdbW3vzn8OfSaPoA1izQeIuhS44','2025-03-30 19:29:10','2025-04-06 19:29:10','okhttp/4.12.0'),(87,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzUyMjc5LCJleHAiOjE3NDM5NTcwNzl9.itPZVc5qn2GTDhay-P0BuNFWdiqqiy6mlcA2OXHBiU0','2025-03-30 19:31:19','2025-04-06 19:31:19','okhttp/4.12.0'),(88,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU0MTc1LCJleHAiOjE3NDM5NTg5NzV9.ECm5hqp-J6EoDoJBuYRJ31TYvOvosWNlyQ-p7kyP0g8','2025-03-30 20:02:55','2025-04-06 20:02:55','okhttp/4.12.0'),(89,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU1MDg5LCJleHAiOjE3NDM5NTk4ODl9.3rz4DzZP1mF81xNIT84jcyJpfg1-N1eQpf1mu1ktJKU','2025-03-30 20:18:09','2025-04-06 20:18:09','okhttp/4.12.0'),(90,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU1MzY1LCJleHAiOjE3NDM5NjAxNjV9.C6Xx5onfXxvpw_jNYNg72-taeCEjdVHQ1nZ7dG8wC1s','2025-03-30 20:22:45','2025-04-06 20:22:45','okhttp/4.12.0'),(91,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU1NTg3LCJleHAiOjE3NDM5NjAzODd9.igYeI3BKNRAI-4QdTfttareA49RfrVzippjhQPNpgUE','2025-03-30 20:26:27','2025-04-06 20:26:27','okhttp/4.12.0'),(92,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU2MDE2LCJleHAiOjE3NDM5NjA4MTZ9.ZURsKrtOm2VcIBTSegx8R2Zm0Xttg-Xy_Xhob0g-o-4','2025-03-30 20:33:36','2025-04-06 20:33:36','okhttp/4.12.0'),(93,91,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTEsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU2MTE4LCJleHAiOjE3NDM5NjA5MTh9.LI6r2DbTgZ9X0Lnzmy8uW1GPbDtRd9_U3ur06AZPyx8','2025-03-30 20:35:18','2025-04-06 20:35:18','okhttp/4.12.0'),(94,91,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTEsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU2MTU5LCJleHAiOjE3NDM5NjA5NTl9.D_tHkHajIBBm-UjHCAcqt7dkwZcW5h7nM6235yPcN5o','2025-03-30 20:35:59','2025-04-06 20:35:59','okhttp/4.12.0'),(95,91,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTEsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU2MzY4LCJleHAiOjE3NDM5NjExNjh9.1mG6dcqpSd4Xyw6HVvs4jcaGVyS0nJl3zsFgWQf1Sl8','2025-03-30 20:39:28','2025-04-06 20:39:28','okhttp/4.12.0'),(96,92,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTIsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU2NTM0LCJleHAiOjE3NDM5NjEzMzR9.8ytEYUf05AjssMMxKxJE3u-FPJYl-tN51JjwnKpS9Z4','2025-03-30 20:42:14','2025-04-06 20:42:14','okhttp/4.12.0'),(97,92,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTIsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU2NTk0LCJleHAiOjE3NDM5NjEzOTR9.8DmOfeVW_Rz0h8ZoUUBs_I0X-hshP5hn_Di31zRi3OE','2025-03-30 20:43:14','2025-04-06 20:43:14','okhttp/4.12.0'),(98,93,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU3MTcwLCJleHAiOjE3NDM5NjE5NzB9.no-PHXtChup_Z1Dob6f3flkHeWnwoRNS4camYFOYGBg','2025-03-30 20:52:50','2025-04-06 20:52:50','okhttp/4.12.0'),(99,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU3NjAyLCJleHAiOjE3NDM5NjI0MDJ9.BBrdKBqd6b6qdaec7jMbMvh506A2ChzHFPwer-vfP4M','2025-03-30 21:00:02','2025-04-06 21:00:02','okhttp/4.12.0'),(100,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU3NjMyLCJleHAiOjE3NDM5NjI0MzJ9.Xp7x27kYWE6XwwHneYhVeWdi8ZVRQECm9nWjVrFk9SY','2025-03-30 21:00:32','2025-04-06 21:00:32','okhttp/4.12.0'),(101,94,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTQsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU3Njk0LCJleHAiOjE3NDM5NjI0OTR9.WgA3tCUEGxhYz_1QYhQoIX3R3MgddISWJxu7aNL6F5Q','2025-03-30 21:01:34','2025-04-06 21:01:34','okhttp/4.12.0'),(102,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU3OTUwLCJleHAiOjE3NDM5NjI3NTB9.tRxo7eJdiw2X4pJjdGGaTcVhClBGwk2MCZ10yz6QBDc','2025-03-30 21:05:50','2025-04-06 21:05:50','okhttp/4.12.0'),(103,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzMzU4MDE2LCJleHAiOjE3NDM5NjI4MTZ9.77aw4Amn1UbhvhUpv9CLiXglbKq1uznXiRJke_51Zpw','2025-03-30 21:06:56','2025-04-06 21:06:56','okhttp/4.12.0'),(104,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDIxOTExLCJleHAiOjE3NDQwMjY3MTF9.jHyHpfkT0njgc7ytX8nl-kFPSLGaoFb2cITXCOs-A7M','2025-03-31 14:51:51','2025-04-07 14:51:51','okhttp/4.12.0'),(105,95,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDIzMTE0LCJleHAiOjE3NDQwMjc5MTR9.w-BrVaCQaG634S4jpX3U9FZq4Nu-AQqzZ3Z90oY4rrY','2025-03-31 15:11:54','2025-04-07 15:11:54','okhttp/4.12.0'),(106,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDI0MTA0LCJleHAiOjE3NDQwMjg5MDR9.qNF3VFGZkMp5kpD3wede0BDOgVxx98aDNLWKZRiCyNI','2025-03-31 15:28:24','2025-04-07 15:28:24','okhttp/4.12.0'),(107,96,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTYsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDI0MjM3LCJleHAiOjE3NDQwMjkwMzd9.EDwNqccuiT-L1Ut0VEMnyH0fNxl2NFh0JolH7Dq0VxA','2025-03-31 15:30:37','2025-04-07 15:30:37','okhttp/4.12.0'),(108,97,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTcsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDI0NDg3LCJleHAiOjE3NDQwMjkyODd9.Drg595IbF658tJSjDDLjRw66aG_eAcdvGUeyfhauINY','2025-03-31 15:34:47','2025-04-07 15:34:47','okhttp/4.12.0'),(109,98,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTgsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDI0NzAxLCJleHAiOjE3NDQwMjk1MDF9.AshP5MYKXWWrTxjhg7dXk1JEyDyYPHBp0Kdf_MkAnzs','2025-03-31 15:38:21','2025-04-07 15:38:21','okhttp/4.12.0'),(110,99,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTksInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDI0OTM2LCJleHAiOjE3NDQwMjk3MzZ9.Nep77iG_nc08yP7lO_KG8gqQ_qcqqxqjKlCEyMdReF4','2025-03-31 15:42:16','2025-04-07 15:42:16','okhttp/4.12.0'),(111,100,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0MzQyNTY5OSwiZXhwIjoxNzQ0MDMwNDk5fQ.qMGf7CZgL5HEXtoV-Gn2KwMlM7_Jk1FFBkT8eXTRrmU','2025-03-31 15:54:59','2025-04-07 15:54:59','okhttp/4.12.0'),(112,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDM3MTM3LCJleHAiOjE3NDQwNDE5Mzd9.-ZQhQe7B0ZViDNqNaReFfXukGpXtfQwInLneJktkPx4','2025-03-31 16:05:37','2025-04-07 16:05:37','okhttp/4.12.0'),(113,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzNDM5OTkwLCJleHAiOjE3NDQwNDQ3OTB9.htXlDnO8Y5BKwjausW1gQDtJAc95-dyZWD893mRnuvU','2025-03-31 16:53:10','2025-04-07 16:53:10','okhttp/4.12.0'),(114,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzOTQ4NTU2LCJleHAiOjE3NDQ1NTMzNTZ9.qzHg0tgoGNfaIKytXkZudiwP6JwVofZl_98M1QOlL1s','2025-04-06 14:09:16','2025-04-13 14:09:16','okhttp/4.12.0'),(115,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzOTYyNzAzLCJleHAiOjE3NDQ1Njc1MDN9.zkm64pYt04WZNC7_qj6YjeMNHNQaMGLgr9hCjjGYBhY','2025-04-06 18:05:03','2025-04-13 18:05:03','okhttp/4.9.2'),(116,101,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxLCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0Mzk2Mjg2NCwiZXhwIjoxNzQ0NTY3NjY0fQ.EM8ZhXl4hx7elMlbG4LtDLk9MWro-ZFfGZaJK2zIR3Y','2025-04-06 18:07:44','2025-04-13 18:07:44','okhttp/4.9.2'),(117,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzOTYzMzA4LCJleHAiOjE3NDQ1NjgxMDh9.Op0b_BgpLaiXxKjUMfXb8oHkjVbNIaz1dt6wTl285VU','2025-04-06 18:15:08','2025-04-13 18:15:08','okhttp/4.9.2'),(118,102,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyLCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0Mzk2MzQ3MSwiZXhwIjoxNzQ0NTY4MjcxfQ.SUwTW9gV8NCLSlY-jlxF5pjdLlRtrE5XuiSu6ya9W08','2025-04-06 18:17:51','2025-04-13 18:17:51','okhttp/4.9.2'),(119,103,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAzLCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0Mzk2MzY5MywiZXhwIjoxNzQ0NTY4NDkzfQ.MLGcGPzpqro502GegsNT9I0WSZNT3hqham3Ygu6YN9s','2025-04-06 18:21:33','2025-04-13 18:21:33','okhttp/4.9.2'),(120,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzOTYzNzQ1LCJleHAiOjE3NDQ1Njg1NDV9.SeVIwGBEO8da-sFlNzrtOI5qQ_7FsFIJNEmqNIBcev0','2025-04-06 18:22:25','2025-04-13 18:22:25','okhttp/4.9.2'),(121,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzOTY0MTUyLCJleHAiOjE3NDQ1Njg5NTJ9.WkByZag0gBf0Ex3jl4yZapYPkbLVYWO-U_D5X6zQ0aE','2025-04-06 18:29:12','2025-04-13 18:29:12','okhttp/4.9.2'),(122,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQzOTY0Nzc0LCJleHAiOjE3NDQ1Njk1NzR9.58L_-QXTquSfgMOdu4DJJw5W8E7Wlvf0aBiIU8RkP5c','2025-04-06 18:39:34','2025-04-13 18:39:34','okhttp/4.9.2'),(123,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ0MTk1Mzg2LCJleHAiOjE3NDQ4MDAxODZ9.j3Ml-1tPWY5Gs74SkkZ3ecpz40R5zL0eyuVLyBmBkK8','2025-04-09 10:43:06','2025-04-16 10:43:06','okhttp/4.9.2'),(124,104,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA0LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NDIxMjk1OSwiZXhwIjoxNzQ0ODE3NzU5fQ.0_kK1blkr5Lj_q8vRkOnL2DxOStSqqFmsKSoCAdKuXk','2025-04-09 15:35:59','2025-04-16 15:35:59','okhttp/4.9.2'),(125,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ0ODAxMTk3LCJleHAiOjE3NDU0MDU5OTd9.2QOqerxHx6wyvb2SkG2TqSWB449pAQ_ryqSlowOnCcs','2025-04-16 13:59:57','2025-04-23 13:59:57','okhttp/4.12.0'),(126,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ0ODAxNjUzLCJleHAiOjE3NDU0MDY0NTN9.wyRVkTAoglxnyk3QaC4op1CVNjWaqzxFTwHWMe5V16k','2025-04-16 14:07:33','2025-04-23 14:07:33','okhttp/4.12.0'),(127,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MDE4MDM4LCJleHAiOjE3NDY2MjI4Mzh9.v9Z2L4z6jXi13VOUmdgb5Tynt9SRvRoIX1NHh0g80Go','2025-04-30 16:00:38','2025-05-07 16:00:38','okhttp/4.12.0'),(128,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MDE4NTc2LCJleHAiOjE3NDY2MjMzNzZ9.Gzx5zsp-L3p7iRWcoHWDCdbhiIXotQXvPztbhRKmb1A','2025-04-30 16:09:36','2025-05-07 16:09:36','okhttp/4.12.0'),(129,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MDE4NzU2LCJleHAiOjE3NDY2MjM1NTZ9.lJDvWiZqCAaxisTaJSCVeQaDx1a2ewAf9Qij8C3XH0I','2025-04-30 16:12:36','2025-05-07 16:12:36','okhttp/4.12.0'),(130,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MDM1MzUxLCJleHAiOjE3NDY2NDAxNTF9.e2ES2e2U6RwJE0Tu-lyNPDY9EqtYMtdr3gfgx6XWW8U','2025-04-30 20:49:11','2025-05-07 20:49:11','okhttp/4.12.0'),(131,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MDM1NTgzLCJleHAiOjE3NDY2NDAzODN9.RQ-WdxY2Zr0vBBG44ACyD9bFULJ3KvLrtbUKNhDOJmE','2025-04-30 20:53:03','2025-05-07 20:53:03','okhttp/4.12.0'),(132,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MTA2Nzc1LCJleHAiOjE3NDY3MTE1NzV9.fXxkQUwerxwZTj-0cR_TLrnuE7aoHBMfdMII50uhu3w','2025-05-01 16:39:35','2025-05-08 16:39:35','okhttp/4.12.0'),(133,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MzY3NjU5LCJleHAiOjE3NDY5NzI0NTl9.ZWXrskcPxov_gULdAmmlz_19BhGMQzGFf2K4DvMG5Lw','2025-05-04 17:07:39','2025-05-11 17:07:39','okhttp/4.12.0'),(134,105,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA1LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NjM2ODE3NywiZXhwIjoxNzQ2OTcyOTc3fQ.d6w1uGvNoRcOGjbMAyr7Qn7qLgDYREbIigL56guyTLc','2025-05-04 17:16:17','2025-05-11 17:16:17','okhttp/4.12.0'),(135,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2MzY4NTQ5LCJleHAiOjE3NDY5NzMzNDl9.gqLi4DZlhFDS6v9Bq0bTjrLC5XbolESu1TGGtAqt6u8','2025-05-04 17:22:29','2025-05-11 17:22:29','okhttp/4.12.0'),(136,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2NDQxMDcyLCJleHAiOjE3NDcwNDU4NzJ9.gBb3WbZRcRV0G2t71It4hlg9QLHjAD_R5lGKGuY896I','2025-05-05 13:31:12','2025-05-12 13:31:12','okhttp/4.12.0'),(137,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2NzIyNDM0LCJleHAiOjE3NDczMjcyMzR9.fzudfZRFO3WSBW01dHzV0kwJ_DARHYEItn7ncwhmOSU','2025-05-08 16:40:34','2025-05-15 16:40:34','okhttp/4.12.0'),(138,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2NzI4ODI4LCJleHAiOjE3NDczMzM2Mjh9.YP2AKM8VvYj2IU206IcMREVvY2vy-favBbnDZtOisdg','2025-05-08 18:27:08','2025-05-15 18:27:08','okhttp/4.12.0'),(139,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2NzI5NTc4LCJleHAiOjE3NDczMzQzNzh9.TCy3rtSlKv09mkUGySx4hYqBa2-RNN6_mougUctPbzU','2025-05-08 18:39:38','2025-05-15 18:39:38','okhttp/4.12.0'),(140,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2NzM3NTQ0LCJleHAiOjE3NDczNDIzNDR9.T3S0LJQFIVREHiBB_1zfWx63f4MmckrqHdxV85sTnBQ','2025-05-08 20:52:24','2025-05-15 20:52:24','okhttp/4.9.2'),(141,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ2ODIwMjU1LCJleHAiOjE3NDc0MjUwNTV9.a-a5yl51PL4OnRlMFW9FQ8mxGpaq0-5f0pQX-cmE8wk','2025-05-09 19:50:55','2025-05-16 19:50:55','okhttp/4.9.2'),(142,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDM2MDI5LCJleHAiOjE3NDc2NDA4Mjl9.CtEsQKnjT1XCfvTLhSiUrogq5RmgXIR6uhTr_pWn10w','2025-05-12 07:47:09','2025-05-19 07:47:09','okhttp/4.9.2'),(143,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQxOTQzLCJleHAiOjE3NDc2NDY3NDN9.x_RDv7mNvm8PrTSgcPTDDj41zZ2Btn2lCaGoDK9LP50','2025-05-12 09:25:43','2025-05-19 09:25:43','okhttp/4.12.0'),(144,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQyMTU0LCJleHAiOjE3NDc2NDY5NTR9.GCt1yHZXK5u02BEnilH6ecJ7xVME4WQNV4JT_ZiXBe8','2025-05-12 09:29:14','2025-05-19 09:29:14','okhttp/4.12.0'),(145,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQ1MDEyLCJleHAiOjE3NDc2NDk4MTJ9.MWb0wwGrXj_DUzTDhxRrn00Jsp5RzS-2gWt9eOnRA_w','2025-05-12 10:16:52','2025-05-19 10:16:52','okhttp/4.12.0'),(146,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQ1Mjk4LCJleHAiOjE3NDc2NTAwOTh9.vGT024BFBA-8eb-3WNOszz1JBMzlsv-Az0zZd8o-oMM','2025-05-12 10:21:38','2025-05-19 10:21:38','okhttp/4.9.2'),(147,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQ4MDQ3LCJleHAiOjE3NDc2NTI4NDd9.4AjDVvCqIsG5WHG5gQP3haKG8GNRaTW9KoXzrzY9zoY','2025-05-12 11:07:27','2025-05-19 11:07:27','okhttp/4.12.0'),(148,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQ4NjIwLCJleHAiOjE3NDc2NTM0MjB9.b7hZYeWXnQeSWl4K-XrjKZFZEAxJ9rsMyaYNzfd_G44','2025-05-12 11:17:00','2025-05-19 11:17:00','okhttp/4.12.0'),(149,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQ5MzUwLCJleHAiOjE3NDc2NTQxNTB9.I9NJiEWjZXu7q9uBv4gv3dp3Kc2gl8_080jKZ0M96R8','2025-05-12 11:29:10','2025-05-19 11:29:10','okhttp/4.9.2'),(150,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDQ5NDUyLCJleHAiOjE3NDc2NTQyNTJ9.r_sit9SpjX1lLCCxsE8ugjejwZu6DpEXPCcAzGzjwH4','2025-05-12 11:30:52','2025-05-19 11:30:52','okhttp/4.12.0'),(151,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDUwMTA1LCJleHAiOjE3NDc2NTQ5MDV9.Jdct-N0AGwLhoGTF7-kORZuwgDqXh2ywhzk-8FovJ7w','2025-05-12 11:41:45','2025-05-19 11:41:45','okhttp/4.12.0'),(152,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MDUxMjY0LCJleHAiOjE3NDc2NTYwNjR9.CNqJnyOO4jodDsx1-50ZswHhhrJjAzQgdq1xTceBxoE','2025-05-12 12:01:04','2025-05-19 12:01:04','okhttp/4.9.2'),(153,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MTUxMDQwLCJleHAiOjE3NDc3NTU4NDB9.VEmPxFEcL3ov8dtjmOhfjUNhYriJHQhl6KD1yLxYB1E','2025-05-13 15:44:00','2025-05-20 15:44:00','okhttp/4.9.2'),(154,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MTUxNDM5LCJleHAiOjE3NDc3NTYyMzl9.8s8kDhZR4ioPqvLFQEbUWD48fwjvsF_Fo_12BnCAyQs','2025-05-13 15:50:39','2025-05-20 15:50:39','okhttp/4.9.2'),(155,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MjMwOTQyLCJleHAiOjE3NDc4MzU3NDJ9.w3OAXdlHY5tr6dhuSVqDNxafm8QooCzQN9A-NHqU_wA','2025-05-14 13:55:42','2025-05-21 13:55:42','okhttp/4.9.2'),(156,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3MjMyNDkyLCJleHAiOjE3NDc4MzcyOTJ9.97wigw39u5CJWoRWWv12aXeiJ36T_157eYaBhZzZvRg','2025-05-14 14:21:32','2025-05-21 14:21:32','okhttp/4.12.0'),(157,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3Mzk3NDg0LCJleHAiOjE3NDgwMDIyODR9.wPKOSjWoWEBzXUuPjroeHXVGwg_Dns-EqjyNLHyV2Y8','2025-05-16 12:11:24','2025-05-23 12:11:24','okhttp/4.9.2'),(158,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3NDA0MTE1LCJleHAiOjE3NDgwMDg5MTV9.-1v3jP6j_dU3xbjjIG7QnD-7jCSQlCrKYT5ZRQaR8T4','2025-05-16 14:01:55','2025-05-23 14:01:55','okhttp/4.9.2'),(159,106,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA2LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzQwNDc0NywiZXhwIjoxNzQ4MDA5NTQ3fQ.g523YG3mMlu5XDEJb75ilBBZkzk_zzvicG0fmVAjgXM','2025-05-16 14:12:27','2025-05-23 14:12:27','okhttp/4.9.2'),(160,107,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA3LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzQwNTA2MSwiZXhwIjoxNzQ4MDA5ODYxfQ.UJ4LpyOBwRN_BxTxsoMTforCYRIX3RXd5kFS0sHykxA','2025-05-16 14:17:41','2025-05-23 14:17:41','okhttp/4.9.2'),(161,108,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA4LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzQwNTEwNywiZXhwIjoxNzQ4MDA5OTA3fQ.Y-3_m340GtnhmfbdQ-T2_61oywc_VK09cYOFIB-sOrY','2025-05-16 14:18:27','2025-05-23 14:18:27','okhttp/4.9.2'),(162,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3NDA3NDUzLCJleHAiOjE3NDgwMTIyNTN9.oXiJj5abaQs7dqKZmNvzo6jdfhIh00wxs6Pjw04qG5M','2025-05-16 14:57:33','2025-05-23 14:57:33','okhttp/4.9.2'),(163,109,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA5LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzQwODU0OCwiZXhwIjoxNzQ4MDEzMzQ4fQ.sSXKBo29oTK01LkZwmsNpVIRpwQuhCiCXCPT_j1sfqI','2025-05-16 15:15:48','2025-05-23 15:15:48','okhttp/4.9.2'),(164,108,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA4LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzQxMDQ3MCwiZXhwIjoxNzQ4MDE1MjcwfQ.rMuXSa0tJZ9gjaoB71k5vVligMR17SgR17VwCH6YJ3w','2025-05-16 15:47:50','2025-05-23 15:47:50','okhttp/4.9.2'),(165,110,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEwLCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzY1MDM0MywiZXhwIjoxNzQ4MjU1MTQzfQ.kM80XBbSGxGFWRHuSGzBkovr9KGDbjDjhOspw39GoVA','2025-05-19 10:25:43','2025-05-26 10:25:43','okhttp/4.9.2'),(166,111,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTExLCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc0NzY1MzUwMiwiZXhwIjoxNzQ4MjU4MzAyfQ.3ZyDRuRI3lF3lK63j6wQiOMHK7aXziZeebVUM8MlKQM','2025-05-19 11:18:22','2025-05-26 11:18:22','okhttp/4.9.2'),(167,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3ODU1NTM3LCJleHAiOjE3NDg0NjAzMzd9.MfMtGhC5QQsTSb7m5d4HRHInWNYD5QgOjffhey2TAPM','2025-05-21 19:25:37','2025-05-28 19:25:37','okhttp/4.9.2'),(168,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ3ODU1Nzg5LCJleHAiOjE3NDg0NjA1ODl9.JODTMiS8ssXLVOaSBcJxD2JIwa3tBhsHXjIOdfk8YzU','2025-05-21 19:29:49','2025-05-28 19:29:49','okhttp/4.9.2'),(169,85,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsInR5cGUiOiJyZWdpc3RlcmVkIiwiaWF0IjoxNzQ4ODcwNDAyLCJleHAiOjE3NDk0NzUyMDJ9.7ff4lRZq0qXu5YMiNhnBkG_FKNTPFl9ayIGTe8UAQbU','2025-06-02 13:20:02','2025-06-09 13:20:02','okhttp/4.9.2'),(170,108,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA4LCJ0eXBlIjoicmVnaXN0ZXJlZCIsImlhdCI6MTc1MTYxNzM5MCwiZXhwIjoxNzUyMjIyMTkwfQ.xAu0MmlhIUmrTafTKcm0pNWcSdA3jFr_UW4-_vnBQ2o','2025-07-04 08:23:10','2025-07-11 08:23:10','okhttp/4.9.2');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sliders`
--

DROP TABLE IF EXISTS `sliders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sliders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `order_number` int(11) DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sliders`
--

LOCK TABLES `sliders` WRITE;
/*!40000 ALTER TABLE `sliders` DISABLE KEYS */;
INSERT INTO `sliders` VALUES (5,'test','/uploads/sliders/1747390290435-592985367.jpg',1,'test',1),(6,'tst','/uploads/sliders/1747390444881-680900552.jpg',2,'test',1);
/*!40000 ALTER TABLE `sliders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','order_manager','kitchen') NOT NULL,
  `last_login_date` datetime DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (3,'Admin User','5551234567','yoremdoner@gmail.com','123','admin','2025-07-04 08:20:25','active');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streets`
--

DROP TABLE IF EXISTS `streets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `streets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `neighborhood_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `neighborhood_id` (`neighborhood_id`),
  CONSTRAINT `fk_streets_neighborhood` FOREIGN KEY (`neighborhood_id`) REFERENCES `neighborhoods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streets`
--

LOCK TABLES `streets` WRITE;
/*!40000 ALTER TABLE `streets` DISABLE KEYS */;
INSERT INTO `streets` VALUES (9,4,'test',1),(10,5,'test',1),(11,6,'test',1),(12,7,'test',1),(13,9,'test',1),(14,10,'sandal sokak',1),(15,11,'sandal sokak',1),(16,11,'sandal sokak',1),(17,12,'sandal sokak',1),(18,13,'sandal sokak',1),(19,14,'sandal sokak',1),(20,15,'sandal sokak',1),(21,16,'sandal sokak',1),(22,4,'sandal sokak',1),(23,5,'sandal sokak',1),(24,6,'sandal sokak',1),(25,7,'sandal sokak',1),(26,9,'sandal sokak',1);
/*!40000 ALTER TABLE `streets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `registration_date` datetime DEFAULT current_timestamp(),
  `last_login_date` datetime DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test Kullanıcı','5551234567','test@ornek.com','2025-03-24 16:47:57','2025-03-25 11:12:40','active'),(56,'Kullanıcı Adı Soyadı','5332075561','kullanici@ornek.com','2025-03-25 15:12:05','2025-03-25 15:12:05','active'),(58,'undefined undefined','5307706801','rtemir1991@gmail.com','2025-03-26 16:27:22',NULL,'active'),(60,'undefined undefined','5307706802','test@gmail.com','2025-03-26 16:29:19',NULL,'active'),(61,'undefined undefined','5307706803','test@gmail.com','2025-03-26 16:36:37',NULL,'active'),(62,'undefined undefined','53307706810','rete@gmail.com','2025-03-26 16:51:48',NULL,'active'),(63,'undefined undefined','5307706808','rte','2025-03-26 16:59:25',NULL,'active'),(64,'undefined undefined','5327522222','test','2025-03-26 17:07:23',NULL,'active'),(67,'undefined undefined','5327771225','test@gmail.com','2025-03-26 17:08:31',NULL,'active'),(68,'undefined undefined','5307706850',NULL,'2025-03-26 18:49:02',NULL,'active'),(72,'undefined undefined','5307706851',NULL,'2025-03-26 19:05:58',NULL,'active'),(79,'undefined undefined','5307706855','yılmaz@gmail.com','2025-03-26 19:35:27',NULL,'active'),(80,'undefined undefined','5307706833',NULL,'2025-03-27 16:49:08',NULL,'active'),(81,'ali yılmaz','5307706834',NULL,'2025-03-27 16:58:47',NULL,'active'),(82,'arif yılmaz','5307706835',NULL,'2025-03-27 19:18:51',NULL,'active'),(83,'cemali yılmaz','5307706836',NULL,'2025-03-27 19:27:34',NULL,'active'),(85,'Temiralp Eryılmaz','5307706809','temiralpin@gmail.com','2025-03-30 18:24:17',NULL,'active'),(86,'Ali Vrli','5307716809',NULL,'2025-03-30 18:35:44',NULL,'active'),(87,'Ak Sns','5511231232',NULL,'2025-03-30 18:45:25',NULL,'active'),(88,'Ak Jd','5561286952',NULL,'2025-03-30 18:47:47',NULL,'active'),(89,'Sj Nsns','5307706800',NULL,'2025-03-30 18:56:56',NULL,'active'),(90,'Ndnd Hsjd','5307706810',NULL,'2025-03-30 19:02:23',NULL,'active'),(91,'Ali Ndkd','5307706811',NULL,'2025-03-30 20:35:18',NULL,'active'),(92,'Fhdjdk Dndm','5307706812',NULL,'2025-03-30 20:42:14',NULL,'active'),(93,'Djjd Snks','5307706813',NULL,'2025-03-30 20:52:50',NULL,'active'),(94,'Abdurrahman Snsmsk','5307706814',NULL,'2025-03-30 21:01:34',NULL,'active'),(95,'Ali Erbek','5307706844',NULL,'2025-03-31 15:11:54',NULL,'active'),(96,'Oguz Test','5307706899',NULL,'2025-03-31 15:30:37',NULL,'active'),(97,'Tester Tester','5307706879',NULL,'2025-03-31 15:34:47',NULL,'active'),(98,'Hddj Nddj','5307706877',NULL,'2025-03-31 15:38:21',NULL,'active'),(99,'Shsj Dndj','5307706887',NULL,'2025-03-31 15:42:16',NULL,'active'),(100,'Dkkd Jdks','5662424548',NULL,'2025-03-31 15:54:59',NULL,'active'),(101,'Abfurra Erko','5307706363',NULL,'2025-04-06 18:07:44',NULL,'active'),(102,'Abudul Djfhsls','5307706362',NULL,'2025-04-06 18:17:51',NULL,'active'),(103,'Hddj Dndk','5223332222',NULL,'2025-04-06 18:21:33',NULL,'active'),(104,'Nevin Eryılmaz Eryilmaz','5369538376',NULL,'2025-04-09 15:35:59',NULL,'active'),(105,'Aun Er','5369665963',NULL,'2025-05-04 17:16:17',NULL,'active'),(106,'Kevser Şam','5451856509',NULL,'2025-05-16 14:12:27',NULL,'active'),(107,'Nevin Eryi','5373786275',NULL,'2025-05-16 14:17:41',NULL,'active'),(108,'Kasım Biten','5422245368',NULL,'2025-05-16 14:18:27',NULL,'active'),(109,'Kadir Kara','5076627199',NULL,'2025-05-16 15:15:48',NULL,'active'),(110,'Beritan İleri ','5397003977',NULL,'2025-05-19 10:25:43',NULL,'active'),(111,'Mert Ünal','5546963133',NULL,'2025-05-19 11:18:22',NULL,'active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_codes`
--

DROP TABLE IF EXISTS `verification_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `code` varchar(6) NOT NULL,
  `purpose` enum('login','registration') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_codes`
--

LOCK TABLES `verification_codes` WRITE;
/*!40000 ALTER TABLE `verification_codes` DISABLE KEYS */;
INSERT INTO `verification_codes` VALUES (1,'5415','273745','','2025-03-18 18:21:10','2025-03-18 18:31:10',0),(2,'45454','764600','','2025-03-18 18:28:38','2025-03-18 18:38:38',0),(3,'05346403437','312738','','2025-03-19 10:30:14','2025-03-19 10:40:14',0),(4,'05346403439','831141','','2025-03-19 10:37:01','2025-03-19 10:47:01',0),(5,'05346403437','123456','login','2025-03-19 11:42:53','2025-03-19 11:52:52',1),(6,'05346403437','123456','login','2025-03-19 11:43:28','2025-03-19 11:53:28',1),(7,'05346403437','123456','login','2025-03-19 11:45:14','2025-03-19 11:55:14',1),(8,'05346403437','123456','login','2025-03-19 11:57:38','2025-03-19 12:07:38',1),(9,'05346403437','123456','login','2025-03-19 12:01:31','2025-03-19 12:11:31',1),(10,'05346403437','123456','login','2025-03-19 12:19:09','2025-03-19 12:29:09',1),(11,'05346403437','123456','login','2025-03-19 12:23:33','2025-03-19 12:26:33',1),(12,'05346403437','123456','login','2025-03-19 12:24:12','2025-03-19 12:27:12',1),(13,'05346403437','123456','login','2025-03-19 12:24:39','2025-03-19 12:27:39',1),(14,'05346403437','123456','login','2025-03-19 12:31:42','2025-03-19 12:34:42',1),(15,'05346403437','123456','login','2025-03-19 12:35:49','2025-03-19 12:38:49',1),(16,'05346403437','123456','login','2025-03-19 12:37:21','2025-03-19 12:40:21',1),(17,'05346403437','123456','login','2025-03-19 12:39:23','2025-03-19 12:42:23',1),(18,'05346403437','123456','login','2025-03-19 12:44:06','2025-03-19 12:47:06',1),(19,'05346403437','123456','login','2025-03-19 12:55:46','2025-03-19 12:58:46',1),(20,'05346403437','123456','login','2025-03-19 12:59:02','2025-03-19 13:02:02',1),(21,'05346403437','123456','login','2025-03-19 13:04:04','2025-03-19 13:07:04',1),(22,'05346403437','123456','login','2025-03-19 14:26:22','2025-03-19 14:29:22',1),(23,'05346403437','123456','login','2025-03-19 15:39:49','2025-03-19 15:42:49',1),(24,'05346403437','123456','login','2025-03-19 15:47:36','2025-03-19 15:50:36',1),(25,'05346403432','123456','login','2025-03-20 11:03:13','2025-03-20 11:06:13',1),(26,'05346403437','123456','login','2025-03-20 15:37:11','2025-03-20 15:40:11',1),(27,'05346403437','123456','login','2025-03-20 15:42:36','2025-03-20 15:45:36',1),(28,'05346403437','123456','login','2025-03-20 16:09:43','2025-03-20 16:12:43',1),(29,'05346403437','123456','login','2025-03-20 16:11:59','2025-03-20 16:14:59',1),(30,'05346403437','123456','login','2025-03-20 16:14:47','2025-03-20 16:17:47',1),(31,'05346403437','123456','login','2025-03-20 16:16:52','2025-03-20 16:19:52',1),(32,'05346403437','123456','login','2025-03-20 16:19:45','2025-03-20 16:22:45',1),(33,'05346403437','123456','login','2025-03-20 16:21:51','2025-03-20 16:24:51',1),(34,'05346403437','123456','login','2025-03-20 17:46:36','2025-03-20 17:49:36',1),(35,'05346403437','123456','login','2025-03-20 17:46:47','2025-03-20 17:49:47',1),(36,'05346403437','123456','login','2025-03-20 18:11:05','2025-03-20 18:14:05',1),(37,'05346403437','123456','login','2025-03-20 18:17:53','2025-03-20 18:20:53',1),(38,'05346403437','123456','login','2025-03-20 18:20:47','2025-03-20 18:23:47',1),(39,'05346403437','123456','login','2025-03-20 18:23:21','2025-03-20 18:26:21',1),(40,'05346403437','123456','login','2025-03-20 18:24:43','2025-03-20 18:27:43',1),(41,'05346403437','123456','login','2025-03-20 18:24:56','2025-03-20 18:27:56',1),(42,'05346403437','123456','login','2025-03-20 18:25:31','2025-03-20 18:28:31',1),(43,'05346403437','123456','login','2025-03-20 18:33:12','2025-03-20 18:36:12',1),(44,'05346403437','123456','login','2025-03-20 18:34:09','2025-03-20 18:37:09',1),(45,'5551234567','123456','login','2025-03-25 10:36:40','2025-03-25 10:39:40',1),(46,'5551234567','123456','login','2025-03-25 12:51:46','2025-03-25 12:54:46',1),(47,'5551234567','123456','login','2025-03-25 12:53:42','2025-03-25 12:56:42',1),(48,'5551234567','123456','login','2025-03-25 13:12:07','2025-03-25 13:15:07',1),(49,'5551234567','123456','login','2025-03-25 13:12:23','2025-03-25 13:15:23',1),(50,'5551234567','123456','login','2025-03-25 13:14:04','2025-03-25 13:17:04',1),(51,'5551234567','123456','login','2025-03-25 13:14:12','2025-03-25 13:17:12',1),(52,'5551234567','123456','login','2025-03-25 13:17:09','2025-03-25 13:20:09',1),(53,'5551234567','123456','login','2025-03-25 13:21:30','2025-03-25 13:24:30',1),(54,'5551234567','123456','login','2025-03-25 13:21:42','2025-03-25 13:24:42',1),(55,'5551234567','123456','login','2025-03-25 13:22:12','2025-03-25 13:25:12',1),(56,'5551234567','123456','login','2025-03-25 13:22:57','2025-03-25 13:25:57',1),(57,'5551234567','123456','login','2025-03-25 13:24:18','2025-03-25 13:27:18',1),(58,'5551234567','123456','login','2025-03-25 13:24:27','2025-03-25 13:27:27',1),(59,'5551234567','123456','login','2025-03-25 13:31:46','2025-03-25 13:34:46',1),(60,'5551234567','123456','login','2025-03-25 14:36:21','2025-03-25 14:39:21',1),(61,'5551234567','123456','login','2025-03-25 14:40:48','2025-03-25 14:43:48',1),(62,'5551234567','123456','login','2025-03-25 14:42:02','2025-03-25 14:45:02',1),(63,'5551234567','123456','login','2025-03-25 14:45:47','2025-03-25 14:48:47',1),(64,'5551234567','123456','login','2025-03-25 14:47:53','2025-03-25 14:50:53',1),(65,'5551234567','123456','login','2025-03-25 14:49:06','2025-03-25 14:52:06',1),(66,'5551234567','123456','login','2025-03-25 14:54:39','2025-03-25 14:57:39',1),(67,'5551234567','123456','login','2025-03-25 14:56:09','2025-03-25 14:59:09',1),(68,'5551234567','123456','login','2025-03-25 15:01:20','2025-03-25 15:04:20',1),(69,'5551234567','123456','login','2025-03-25 15:02:17','2025-03-25 15:05:17',1),(70,'5551234567','123456','login','2025-03-25 15:06:35','2025-03-25 15:09:35',1),(71,'5551234567','123456','login','2025-03-25 15:07:56','2025-03-25 15:10:56',1),(72,'5551234567','123456','login','2025-03-25 15:09:37','2025-03-25 15:12:37',1),(73,'5332075561','123456','login','2025-03-25 15:12:22','2025-03-25 15:15:22',1),(74,'5332075561','123456','login','2025-03-25 15:20:13','2025-03-25 15:23:13',1),(75,'5332075561','123456','login','2025-03-25 15:22:42','2025-03-25 15:25:42',1),(76,'5332075561','123456','login','2025-03-25 15:23:10','2025-03-25 15:26:10',1),(77,'5332075561','123456','login','2025-03-25 15:29:47','2025-03-25 15:32:47',1),(78,'5332075561','123456','login','2025-03-25 15:32:55','2025-03-25 15:35:55',1),(79,'5332075561','123455','login','2025-03-25 15:34:17','2025-03-25 15:37:17',0),(80,'5332075561','123455','login','2025-03-25 15:37:08','2025-03-25 15:40:08',0),(81,'5332075561','123455','login','2025-03-25 15:41:46','2025-03-25 15:44:46',0),(82,'5332075561','123455','login','2025-03-25 15:45:26','2025-03-25 15:48:26',0),(83,'5332075561','123456','login','2025-03-25 16:30:14','2025-03-25 16:33:14',1),(84,'5332075561','123456','login','2025-03-25 16:50:21','2025-03-25 16:53:21',1),(85,'5332075561','123456','login','2025-03-25 16:51:28','2025-03-25 16:54:28',1),(86,'5332075561','123456','login','2025-03-25 16:51:49','2025-03-25 16:54:49',1),(87,'5332075561','123456','login','2025-03-25 16:52:16','2025-03-25 16:55:16',1),(88,'5332075561','123456','login','2025-03-25 16:53:20','2025-03-25 16:56:20',1),(89,'5332075561','123456','login','2025-03-25 16:54:03','2025-03-25 16:57:03',1),(90,'5332075561','123456','login','2025-03-25 16:56:40','2025-03-25 16:59:40',1),(91,'5332075561','123456','login','2025-03-25 16:57:50','2025-03-25 17:00:50',1),(92,'5332075561','123456','login','2025-03-25 16:59:04','2025-03-25 17:02:04',1),(93,'5332075561','123456','login','2025-03-25 17:06:19','2025-03-25 17:09:19',1),(94,'5332075561','123456','login','2025-03-25 17:07:53','2025-03-25 17:10:53',1),(95,'5332075561','123456','login','2025-03-25 17:30:57','2025-03-25 17:33:57',1),(96,'5332075561','123456','login','2025-03-25 17:31:55','2025-03-25 17:34:55',1),(97,'5332075561','123456','login','2025-03-25 17:49:49','2025-03-25 17:52:49',1),(98,'5332075561','123456','login','2025-03-25 17:50:19','2025-03-25 17:53:19',1),(99,'5332075561','123456','login','2025-03-25 17:50:37','2025-03-25 17:53:37',1),(100,'5332075561','123456','login','2025-03-26 15:31:52','2025-03-26 15:34:52',1),(101,'5332075561','123456','login','2025-03-26 15:32:18','2025-03-26 15:35:18',1),(102,'5332075561','123456','login','2025-03-26 15:44:34','2025-03-26 15:47:34',1),(103,'5332075561','123456','login','2025-03-26 16:39:20','2025-03-26 16:42:20',1),(104,'5332075561','123456','login','2025-03-26 16:52:33','2025-03-26 16:55:33',1),(105,'5332075561','123456','login','2025-03-26 17:06:04','2025-03-26 17:09:04',1),(106,'5332075561','123456','login','2025-03-26 18:37:34','2025-03-26 18:40:34',1),(107,'5307706850','123456','login','2025-03-26 18:57:17','2025-03-26 19:00:17',0),(108,'5307706855','123456','registration','2025-03-26 19:35:27','2025-03-26 19:38:27',0),(109,'5307706851','123456','registration','2025-03-26 19:46:16','2025-03-26 19:49:16',0),(110,'5307706851','123456','registration','2025-03-26 19:51:02','2025-03-26 19:54:02',0),(111,'5307706851','123456','registration','2025-03-26 19:52:12','2025-03-26 19:55:12',0),(112,'5332075561','123456','login','2025-03-27 15:14:08','2025-03-27 15:17:08',1),(113,'5332075561','123456','login','2025-03-27 15:15:11','2025-03-27 15:18:11',1),(114,'5332075561','123456','login','2025-03-27 15:16:28','2025-03-27 15:19:28',1),(115,'5307706855','123456','registration','2025-03-27 15:17:05','2025-03-27 15:20:05',0),(116,'5307706855','123456','registration','2025-03-27 15:18:17','2025-03-27 15:21:17',0),(117,'5307706855','123456','registration','2025-03-27 15:19:12','2025-03-27 15:22:12',0),(118,'5307706850','123456','registration','2025-03-27 15:29:22','2025-03-27 15:32:22',1),(119,'5307706850','123456','registration','2025-03-27 15:31:47','2025-03-27 15:34:47',1),(120,'5332075561','123456','login','2025-03-27 15:32:26','2025-03-27 15:35:26',1),(121,'5307706850','123456','registration','2025-03-27 15:33:42','2025-03-27 15:36:42',1),(122,'5551234567','123456','login','2025-03-27 15:34:54','2025-03-27 15:37:54',1),(123,'5307706850','123456','registration','2025-03-27 15:56:51','2025-03-27 15:59:51',1),(124,'5332075561','123456','login','2025-03-27 15:58:02','2025-03-27 16:01:02',1),(125,'5332075561','123456','login','2025-03-27 15:59:23','2025-03-27 16:02:23',1),(126,'5332075561','123456','login','2025-03-27 16:00:33','2025-03-27 16:03:33',1),(127,'5332075561','123456','login','2025-03-27 16:02:48','2025-03-27 16:05:48',1),(128,'5332075561','123456','login','2025-03-27 16:04:28','2025-03-27 16:07:28',1),(129,'5307706809','123456','login','2025-03-27 16:05:47','2025-03-27 16:08:47',1),(130,'5332075561','123456','login','2025-03-27 16:11:54','2025-03-27 16:14:54',1),(131,'5307706850','123456','registration','2025-03-27 16:12:41','2025-03-27 16:15:41',1),(132,'5332075561','123456','login','2025-03-27 16:13:45','2025-03-27 16:16:45',1),(133,'5307706850','123456','registration','2025-03-27 16:13:57','2025-03-27 16:16:57',1),(134,'5307706850','123456','registration','2025-03-27 16:15:10','2025-03-27 16:18:10',1),(135,'5307706850','123456','registration','2025-03-27 16:17:16','2025-03-27 16:20:16',1),(136,'5307706850','123456','registration','2025-03-27 16:17:33','2025-03-27 16:20:33',1),(137,'5307706850','123456','registration','2025-03-27 16:20:23','2025-03-27 16:23:23',1),(138,'5307706850','123456','registration','2025-03-27 16:23:14','2025-03-27 16:26:14',1),(139,'5307706833','123456','registration','2025-03-27 16:31:55','2025-03-27 16:34:55',1),(140,'5307706833','123456','registration','2025-03-27 16:32:58','2025-03-27 16:35:58',1),(141,'5307706833','123456','registration','2025-03-27 16:33:50','2025-03-27 16:36:50',1),(142,'5307706833','123456','registration','2025-03-27 16:46:57','2025-03-27 16:49:57',1),(143,'5307706833','123456','registration','2025-03-27 16:48:52','2025-03-27 16:51:52',1),(144,'5307706833','123456','registration','2025-03-27 16:49:04','2025-03-27 16:52:04',1),(145,'5307706834','123456','registration','2025-03-27 16:57:28','2025-03-27 17:00:28',1),(146,'5307706834','123456','registration','2025-03-27 16:58:11','2025-03-27 17:01:11',1),(147,'5307706834','123456','registration','2025-03-27 16:58:25','2025-03-27 17:01:25',1),(148,'5307706834','123456','registration','2025-03-27 16:58:43','2025-03-27 17:01:43',1),(149,'5307706835','123456','registration','2025-03-27 19:18:42','2025-03-27 19:21:42',1),(150,'5332075561','123456','login','2025-03-27 19:20:15','2025-03-27 19:23:15',1),(151,'5332075561','123456','login','2025-03-27 19:25:17','2025-03-27 19:28:17',1),(152,'5307706836','123456','registration','2025-03-27 19:27:29','2025-03-27 19:30:29',1),(153,'5332075561','123456','login','2025-03-27 19:27:43','2025-03-27 19:30:43',1),(154,'5307706836','123456','login','2025-03-27 19:28:34','2025-03-27 19:31:34',1),(155,'5307706836','123456','registration','2025-03-28 17:06:45','2025-03-28 17:09:45',1),(156,'5307706836','123456','login','2025-03-28 17:11:15','2025-03-28 17:14:15',1),(157,'5332075561','123456','login','2025-03-28 17:17:46','2025-03-28 17:20:46',1),(158,'5332075561','123456','login','2025-03-28 17:30:15','2025-03-28 17:33:15',1),(159,'5332075561','123456','login','2025-03-28 17:39:18','2025-03-28 17:42:18',1),(160,'5332075561','123456','login','2025-03-28 17:45:30','2025-03-28 17:48:30',1),(161,'5332075561','123456','login','2025-03-29 10:44:59','2025-03-29 10:47:59',1),(162,'5332075561','123456','login','2025-03-29 11:57:56','2025-03-29 12:00:56',1),(163,'5332075561','123456','login','2025-03-29 12:00:22','2025-03-29 12:03:22',1),(164,'5332075561','123456','login','2025-03-29 13:02:47','2025-03-29 13:05:47',1),(165,'5332075561','569364','login','2025-03-29 13:14:54','2025-03-29 13:17:54',0),(166,'5332075561','614254','login','2025-03-29 13:15:05','2025-03-29 13:18:05',1),(167,'5332075561','855205','login','2025-03-29 13:20:27','2025-03-29 13:23:27',1),(168,'5332075561','194657','login','2025-03-29 13:26:42','2025-03-29 13:29:42',1),(169,'5332075561','231467','login','2025-03-29 13:34:58','2025-03-29 13:37:58',1),(170,'5332075561','626186','login','2025-03-30 17:50:52','2025-03-30 17:53:52',1),(171,'5332075561','452139','login','2025-03-30 18:06:32','2025-03-30 18:09:32',1),(172,'5307706809','894591','registration','2025-03-30 18:24:02','2025-03-30 18:27:02',1),(173,'5307706809','623569','login','2025-03-30 18:24:51','2025-03-30 18:27:51',1),(174,'5307716809','675106','registration','2025-03-30 18:35:30','2025-03-30 18:38:30',1),(175,'5307716809','167603','login','2025-03-30 18:37:00','2025-03-30 18:40:00',1),(176,'5511231232','516149','registration','2025-03-30 18:45:15','2025-03-30 18:48:15',1),(177,'5561286952','361502','registration','2025-03-30 18:47:40','2025-03-30 18:50:40',1),(178,'5561286952','710880','login','2025-03-30 18:48:33','2025-03-30 18:51:33',1),(179,'5307706800','973458','registration','2025-03-30 18:56:51','2025-03-30 18:59:51',1),(180,'5307706810','850153','registration','2025-03-30 19:02:14','2025-03-30 19:05:14',1),(181,'5307706809','594309','login','2025-03-30 19:08:29','2025-03-30 19:11:29',1),(182,'5307706809','515661','login','2025-03-30 19:10:32','2025-03-30 19:13:32',1),(183,'5307706809','280338','login','2025-03-30 19:19:02','2025-03-30 19:22:02',1),(184,'5307706809','881574','login','2025-03-30 19:19:36','2025-03-30 19:22:36',1),(185,'5307706809','905795','login','2025-03-30 19:20:08','2025-03-30 19:23:08',1),(186,'5307706809','401273','login','2025-03-30 19:27:32','2025-03-30 19:30:32',0),(187,'5307706809','856378','login','2025-03-30 19:28:18','2025-03-30 19:31:18',1),(188,'5307706809','173958','login','2025-03-30 19:28:50','2025-03-30 19:31:50',1),(189,'5307706809','243658','login','2025-03-30 19:29:04','2025-03-30 19:32:04',1),(190,'5307706809','653382','login','2025-03-30 19:31:12','2025-03-30 19:34:12',1),(191,'5307706809','459910','login','2025-03-30 20:02:43','2025-03-30 20:05:43',1),(192,'5307706809','346354','login','2025-03-30 20:17:46','2025-03-30 20:20:46',1),(193,'5307706809','173266','login','2025-03-30 20:22:34','2025-03-30 20:25:34',1),(194,'5307706809','491079','login','2025-03-30 20:26:17','2025-03-30 20:29:17',1),(195,'5307706809','393279','login','2025-03-30 20:33:22','2025-03-30 20:36:22',1),(196,'5307706811','857515','registration','2025-03-30 20:35:06','2025-03-30 20:38:06',1),(197,'5307706811','796244','login','2025-03-30 20:35:51','2025-03-30 20:38:51',1),(198,'5307706811','499637','login','2025-03-30 20:39:19','2025-03-30 20:42:19',1),(199,'5307706812','613132','registration','2025-03-30 20:42:03','2025-03-30 20:45:03',1),(200,'5307706812','755510','login','2025-03-30 20:43:06','2025-03-30 20:46:06',1),(201,'5307706813','224275','registration','2025-03-30 20:52:33','2025-03-30 20:55:33',1),(202,'5307706809','160043','login','2025-03-30 20:59:50','2025-03-30 21:02:50',1),(203,'5307706809','611954','login','2025-03-30 21:00:26','2025-03-30 21:03:26',1),(204,'5307706814','403164','registration','2025-03-30 21:01:16','2025-03-30 21:04:16',1),(205,'5307706809','545361','login','2025-03-30 21:05:34','2025-03-30 21:08:34',1),(206,'5307706809','344831','login','2025-03-30 21:06:47','2025-03-30 21:09:47',1),(207,'5307706809','459576','login','2025-03-31 12:38:10','2025-03-31 12:41:10',0),(208,'5307706809','134031','login','2025-03-31 12:40:45','2025-03-31 12:43:45',0),(209,'5307706809','306782','login','2025-03-31 12:42:38','2025-03-31 12:45:38',0),(210,'5307706809','569253','login','2025-03-31 12:44:39','2025-03-31 12:47:39',0),(211,'5307706809','679168','login','2025-03-31 12:45:25','2025-03-31 12:48:25',0),(212,'5307706809','952981','login','2025-03-31 13:03:41','2025-03-31 13:06:41',0),(213,'5307706809','342435','login','2025-03-31 14:51:38','2025-03-31 14:54:38',1),(214,'5307706809','851563','login','2025-03-31 14:58:59','2025-03-31 15:01:59',0),(215,'5307706809','521408','login','2025-03-31 15:00:54','2025-03-31 15:03:54',0),(216,'5307706809','381833','login','2025-03-31 15:02:09','2025-03-31 15:05:09',0),(217,'5307706809','679283','login','2025-03-31 15:07:58','2025-03-31 15:10:58',0),(218,'5307706809','739004','login','2025-03-31 15:09:50','2025-03-31 15:12:50',0),(219,'5307706844','205653','registration','2025-03-31 15:11:39','2025-03-31 15:14:39',1),(220,'5307706809','765782','login','2025-03-31 15:18:19','2025-03-31 15:21:19',0),(221,'5307706809','598068','login','2025-03-31 15:22:59','2025-03-31 15:25:59',0),(222,'5307706809','922031','login','2025-03-31 15:28:00','2025-03-31 15:30:58',1),(223,'5307706899','740352','registration','2025-03-31 15:30:25','2025-03-31 15:33:25',1),(224,'5307706899','291218','login','2025-03-31 15:32:10','2025-03-31 15:35:10',0),(225,'5307706899','973207','login','2025-03-31 15:33:22','2025-03-31 15:36:22',0),(226,'5307706879','429972','registration','2025-03-31 15:34:32','2025-03-31 15:37:32',1),(227,'5307706877','952543','registration','2025-03-31 15:38:04','2025-03-31 15:41:04',1),(228,'5307706887','265855','registration','2025-03-31 15:41:57','2025-03-31 15:44:57',1),(229,'5662424548','176233','registration','2025-03-31 15:54:06','2025-03-31 15:57:06',1),(230,'5307706809','122472','login','2025-03-31 16:05:06','2025-03-31 16:08:05',1),(231,'5307706809','327749','login','2025-03-31 16:52:55','2025-03-31 16:55:54',1),(232,'5307706809','622375','login','2025-03-31 16:53:52','2025-03-31 16:56:51',0),(233,'5307706809','629782','login','2025-03-31 18:48:09','2025-03-31 18:51:08',0),(234,'5307706809','963463','login','2025-04-06 14:09:00','2025-04-06 14:11:59',1),(235,'5307706809','787951','login','2025-04-06 17:22:53','2025-04-06 17:25:52',0),(236,'5307706809','725223','login','2025-04-06 17:24:02','2025-04-06 17:27:02',0),(237,'5332075561','280660','login','2025-04-06 17:24:19','2025-04-06 17:27:19',0),(238,'5307706363','821124','registration','2025-04-06 17:25:35','2025-04-06 17:28:35',0),(239,'5332075561','146331','login','2025-04-06 17:29:08','2025-04-06 17:32:08',0),(240,'5307706809','606723','login','2025-04-06 17:30:48','2025-04-06 17:33:47',0),(241,'5307706363','510064','registration','2025-04-06 17:32:07','2025-04-06 17:35:07',0),(242,'5307706809','691786','login','2025-04-06 17:42:55','2025-04-06 17:45:55',0),(243,'5307706809','775611','login','2025-04-06 17:49:17','2025-04-06 17:52:17',0),(244,'5307706809','331413','login','2025-04-06 18:04:44','2025-04-06 18:07:43',1),(245,'5307706363','583463','registration','2025-04-06 18:07:32','2025-04-06 18:10:32',1),(246,'5307706809','390838','login','2025-04-06 18:14:53','2025-04-06 18:17:53',1),(247,'5307706362','766096','registration','2025-04-06 18:17:19','2025-04-06 18:20:19',0),(248,'5307706362','186378','registration','2025-04-06 18:17:36','2025-04-06 18:20:36',1),(249,'5223332222','884619','registration','2025-04-06 18:20:46','2025-04-06 18:23:46',0),(250,'5223332222','475825','registration','2025-04-06 18:21:05','2025-04-06 18:24:05',0),(251,'5223332222','575555','registration','2025-04-06 18:21:19','2025-04-06 18:24:19',1),(252,'5307706809','795060','login','2025-04-06 18:22:13','2025-04-06 18:25:12',1),(253,'5307706809','232324','login','2025-04-06 18:25:00','2025-04-06 18:27:59',0),(254,'5307706809','466151','login','2025-04-06 18:25:19','2025-04-06 18:28:18',0),(255,'5307706809','664218','login','2025-04-06 18:25:22','2025-04-06 18:28:21',0),(256,'5307706809','557058','login','2025-04-06 18:25:24','2025-04-06 18:28:23',0),(257,'5307706809','919404','login','2025-04-06 18:28:54','2025-04-06 18:31:53',1),(258,'5307706809','427884','login','2025-04-06 18:38:33','2025-04-06 18:41:32',1),(259,'5307706809','928945','login','2025-04-09 10:42:37','2025-04-09 10:45:37',1),(260,'5369538376','945661','registration','2025-04-09 15:35:44','2025-04-09 15:38:44',1),(261,'5307706809','308900','login','2025-04-16 13:59:40','2025-04-16 14:02:39',1),(262,'5307706809','882914','login','2025-04-16 14:06:58','2025-04-16 14:09:56',1),(263,'5307706809','385591','login','2025-04-30 16:00:25','2025-04-30 16:03:23',1),(264,'5307706809','760053','login','2025-04-30 16:09:23','2025-04-30 16:12:21',1),(265,'5307706809','726328','login','2025-04-30 16:12:22','2025-04-30 16:15:20',1),(266,'5307706809','681481','login','2025-04-30 19:39:14','2025-04-30 19:42:11',0),(267,'5307706809','518118','login','2025-04-30 19:41:33','2025-04-30 19:44:29',0),(268,'5307706809','671775','login','2025-04-30 19:42:35','2025-04-30 19:45:32',0),(269,'5307706809','170959','login','2025-04-30 19:56:26','2025-04-30 19:59:23',0),(270,'5307706809','309648','login','2025-04-30 19:57:41','2025-04-30 20:00:38',0),(271,'5307706809','494222','login','2025-04-30 20:48:45','2025-04-30 20:51:42',1),(272,'5307706809','899514','login','2025-04-30 20:52:39','2025-04-30 20:55:39',1),(273,'5307706809','451608','login','2025-05-01 16:39:21','2025-05-01 16:42:21',1),(274,'5307706809','171115','login','2025-05-04 17:07:25','2025-05-04 17:10:24',1),(275,'5332075561','615742','login','2025-05-04 17:08:59','2025-05-04 17:11:59',0),(276,'5369665963','122064','registration','2025-05-04 17:10:42','2025-05-04 17:13:42',0),(277,'5369665963','217209','registration','2025-05-04 17:12:00','2025-05-04 17:15:00',0),(278,'5369665963','359446','registration','2025-05-04 17:15:11','2025-05-04 17:18:11',1),(279,'5307706809','350514','login','2025-05-04 17:22:07','2025-05-04 17:25:06',1),(280,'5307706809','831073','login','2025-05-05 13:31:00','2025-05-05 13:33:59',1),(281,'5307706809','718327','login','2025-05-05 15:50:37','2025-05-05 15:53:36',0),(282,'5307706809','620689','login','2025-05-08 16:40:02','2025-05-08 16:43:02',0),(283,'5307706809','720047','login','2025-05-08 16:40:20','2025-05-08 16:43:20',1),(284,'5307706809','191712','login','2025-05-08 18:26:54','2025-05-08 18:29:53',1),(285,'5307706809','866900','login','2025-05-08 18:39:24','2025-05-08 18:42:23',1),(286,'5307706809','837752','login','2025-05-08 20:52:07','2025-05-08 20:55:06',1),(287,'5307706809','869017','login','2025-05-09 19:50:40','2025-05-09 19:53:39',1),(288,'5307706809','636971','login','2025-05-12 07:46:52','2025-05-12 07:49:51',1),(289,'5307706809','583695','login','2025-05-12 09:13:56','2025-05-12 09:16:55',0),(290,'5307706809','718151','login','2025-05-12 09:25:30','2025-05-12 09:28:29',1),(291,'5307706809','249440','login','2025-05-12 09:29:02','2025-05-12 09:32:02',1),(292,'5307706809','118422','login','2025-05-12 10:16:42','2025-05-12 10:19:41',1),(293,'5307706809','321925','login','2025-05-12 10:21:27','2025-05-12 10:24:26',1),(294,'5307706809','721392','login','2025-05-12 11:07:04','2025-05-12 11:10:03',1),(295,'5307706809','574935','login','2025-05-12 11:16:44','2025-05-12 11:19:43',1),(296,'5307706809','925691','login','2025-05-12 11:28:56','2025-05-12 11:31:56',1),(297,'5307706809','306502','login','2025-05-12 11:30:39','2025-05-12 11:33:39',1),(298,'5307706809','834463','login','2025-05-12 11:41:26','2025-05-12 11:44:25',1),(299,'5307706809','104507','login','2025-05-12 12:00:46','2025-05-12 12:03:46',1),(300,'5332077561','588591','registration','2025-05-13 12:15:45','2025-05-13 12:18:45',0),(301,'5307706809','402708','login','2025-05-13 15:43:49','2025-05-13 15:46:48',1),(302,'5307706809','620673','login','2025-05-13 15:50:27','2025-05-13 15:53:26',1),(303,'5307706809','243710','login','2025-05-14 13:55:24','2025-05-14 13:58:24',1),(304,'5307706809','502653','login','2025-05-14 14:21:18','2025-05-14 14:24:17',1),(305,'5307706809','123456','login','2025-05-16 12:11:13','2025-05-16 12:14:12',1),(306,'5307706809','123456','login','2025-05-16 14:01:52','2025-05-16 14:04:51',1),(307,'5451856509','123456','registration','2025-05-16 14:12:05','2025-05-16 14:15:05',1),(308,'5369508376','123456','registration','2025-05-16 14:13:28','2025-05-16 14:16:28',0),(309,'5373786275','123456','registration','2025-05-16 14:14:46','2025-05-16 14:17:46',1),(310,'5373786275','123456','registration','2025-05-16 14:17:28','2025-05-16 14:20:28',1),(311,'5422245368','123456','registration','2025-05-16 14:18:07','2025-05-16 14:21:07',1),(312,'5307706809','763390','login','2025-05-16 14:57:21','2025-05-16 15:00:20',1),(313,'5076627199','658322','registration','2025-05-16 15:15:27','2025-05-16 15:18:27',1),(314,'5422245368','711386','login','2025-05-16 15:47:31','2025-05-16 15:50:30',1),(315,'5307706809','814534','login','2025-05-18 16:56:01','2025-05-18 16:59:00',0),(316,'5397003977','839958','registration','2025-05-19 10:25:23','2025-05-19 10:28:23',1),(317,'5546963133','850389','registration','2025-05-19 11:18:10','2025-05-19 11:21:10',1),(318,'5307706809','123456','login','2025-05-21 19:25:16','2025-05-21 19:28:15',1),(319,'5307706809','123456','login','2025-05-21 19:29:04','2025-05-21 19:32:03',1),(320,'5307706809','123456','login','2025-06-02 13:19:59','2025-06-02 13:22:59',1),(321,'5422245368','123456','login','2025-07-04 08:22:06','2025-07-04 08:25:05',1);
/*!40000 ALTER TABLE `verification_codes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-20 13:37:48
