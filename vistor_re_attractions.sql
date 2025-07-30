-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: vistor
-- ------------------------------------------------------
-- Server version	8.0.42

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

--
-- Table structure for table `re_attractions`
--

DROP TABLE IF EXISTS `re_attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `re_attractions` (
  `re_a_id` int NOT NULL AUTO_INCREMENT,
  `t_id` decimal(10,0) DEFAULT NULL,
  `a_id` int NOT NULL,
  `vote_like` int DEFAULT '0',
  `who_like` json DEFAULT NULL,
  `vote_love` int DEFAULT '0',
  `who_love` json DEFAULT NULL,
  PRIMARY KEY (`re_a_id`),
  KEY `a_id` (`a_id`),
  CONSTRAINT `re_attractions_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `attractions` (`a_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `re_attractions`
--

LOCK TABLES `re_attractions` WRITE;
/*!40000 ALTER TABLE `re_attractions` DISABLE KEYS */;
INSERT INTO `re_attractions` VALUES (1,1,1,2,'[\"666\", \"777\"]',5,'[\"111\", \"222\", \"333\", \"444\", \"555\"]'),(2,1,2,2,'[\"111\", \"222\"]',0,NULL),(3,NULL,4,2,NULL,8,NULL),(4,NULL,8,7,NULL,0,NULL),(5,NULL,8,4,NULL,2,NULL),(6,NULL,3,4,NULL,2,NULL),(7,NULL,8,7,NULL,0,NULL),(8,NULL,10,4,NULL,3,NULL),(9,NULL,9,6,NULL,1,NULL),(10,NULL,8,7,NULL,0,NULL),(11,NULL,10,2,NULL,5,NULL),(12,NULL,4,1,NULL,4,NULL),(13,NULL,9,3,NULL,5,NULL),(14,NULL,9,2,NULL,7,NULL),(15,NULL,6,7,NULL,7,NULL);
/*!40000 ALTER TABLE `re_attractions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30  9:02:17
