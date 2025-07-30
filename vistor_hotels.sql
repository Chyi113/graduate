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
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `h_id` int NOT NULL,
  `name_zh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cin_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cout_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`h_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'蘇黎世皇冠假日酒店','Crowne Plaza Zurich by IHG','Badenerstrasse 420, 8040 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpek3qgmMsvVrINjGI-8Q_l414UwNwUdTMoFQOAp5us9acUO3zhBb-UxCtlrLrzPc_gV0y55J6jNp6ZEsyRAvf4sEr9wyvcQINJiAlSqs6xNwbQDo6MYPk0OiyoxjGlO0FOPB3kbjC5Nh-ELdSJ2mbFdKn_DEshGxyV2k5dSqVQ3MlfErWDoeJKSmujow2t5VwGUej-xudAQh1WIoCYLR63XuOrupJwBDKBfQMZkWSTE8XoztpgWSyC1l6PRTY_XtXEt427lJPcvdNpyPmTkhGRlimpnFb15C6KCC_aLm-uBhGFynfw&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(2,NULL,'Hotel UTO KULM car-free hideaway in Zurich','Uetliberg 652, 8143 Uetliberg, 瑞士','Switzerland','Zurich',NULL,NULL,'4.2',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpcoillI6VrcMRiGISEijGOK0Rwze-AP_Ads_QJlr-hRaZBYtCqbKuw7Vmi_k-Ls3qkTwkYMDSP7AVBHMHgP9haKTNOfCxPu2sboi5W21PLUwb6t7a2NDIhvvvtJHDccAdl_gCaCtysuYsbTAIb1XyPNfY6kjF79D39Jo96247Yg5w0Ru8dSw6zmpWUsyoWyy7O49M7e2eFffWy7rm3ARfoYKYAGJmlqCNJPp4gmdn_6aoPEqv5ZQfYcTDHtRqupSQ-X--HiR73XJBFZtYTxf99JxdZRJ8YWg_cgHlDTK-PI8Z7X9TE&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(3,NULL,'Boutique Hotel Seefeld','Seefeldstrasse 63, 8008 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4.4',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpdCkLD5ekqkAhBGFcpL3jg_9_THwJsJCAV-XcbFccIobiu6BhwO0kBr5FGORGrxuUIAI6GHr1p16C1QYrMCBgCpPoY_HVY9Lb630_UAeD-isN9VVL6jvDdsUC9H1VTnRrCVRbVWZnPGytww7iPLZUU2-ZmvTmpPbadSqsOsOnGUhGsKQ_PTOXtamWnSVYBfIVk-vFnKH5cVgw6eBQi2OErM67JYMi7yu9YLwOKZTmXd2ekwPS-LtW2O8hOf2h_OCxom7JBxicP1CoHX7UtzfHCNWdqGZWmkv6FHHeEF_PuXoD3MPnU&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(4,NULL,'MEININGER Hotel Zürich Greencity','Maneggstrasse 41, 8041 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpcdkOAevIQIZsnsHa0OHqq_NYWK8qVh5wU93INEGOAwN3tkOY1OAC2fWI8ciOvV5Vj9XF4bsTd4IZBVRzzr77_KQalsdl_2Qeml5o79qqk-lkidz4NM93exw1G-B3QbFc5caT2lRnaf0Ft7iak2vUdj4ZGlfKJQFHZyk8dUxKYKSS_w72T7av_ahUIIyY1MUPYKfcxz0RLflsCOSxG47Ltjhe7r1mvVgwfaugSfXU9VdrDZrVb0PppKa9ClSVrR3JpgEYAOKdkVz54LUxeNAGygZ7kcd_46cwKS4tIKiEuklLxNgs4&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(5,NULL,'ibis Styles Zurich City Center','Stampfenbachstrasse 60, 8006 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpdzWhfkqXDg_VTCfEnVb_hQrXNiBuT9oGphaZCAfazXtQ31emV5JuaYtHETcCrgkYmlFZK_uI6szA8ltrVSarVoPTTZPPKMpIny5MbiRubiYsWdon8UWCc-wlGDiMwF3bDgE8ek9id9oXlVe15br2oZD8JD3pvA6s4iCWfVKiGJspOwclPkrAkzxkr3c4kWfWja45GGru32fsAebPvsx4EX-l8vqRCi_JWbgLvCM36PYzlRypBlJjXojIuX6f9BLQEO82T83LUZnofPyaoyt0ZTeSDEFVCRJE4gWCo0o80Jo3FxMRI&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(6,'蘇黎世萬豪酒店','Zurich Marriott Hotel','Neumühlequai 42, 8006 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4.3',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpdoTnsmiJysXxglg-lfMbHop6Hxrnljc0Hdj3AoSKg-TkQr_298_e0digz5QMUXw4PXOUroTm51AvRRhcg_93dadLhTVZvxJ0qbVZC5jsZ58haWpb-qv0_U6CA3miF5wx7Vvy7Gs2haP2FMl58SQGhUaSAW8bXVXFUykJZfcjO__RHfroGtiEcYnfBAVFTIABFowf6IVepfuxer6dL1wghs7HMDk_0ba7VNf47rwH7Kzic27JQpekm3jP7zNGmxbmahqsIh6sLOmNtPDz1r2ODbf-_IwkNDms-xDOiYNGhITvM3KaQ&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(7,NULL,'Hotel Alexander Zürich','Niederdorfstrasse 40, 8001 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4.5',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpcAdEvzdufFjT3Kilw_orm1qgql7BNBQGEEEkCdKFmc-aV6EqNkDCWRJVWbGOMNTptecmmoYEAHBYAH3JqJG86plCqAKLi-hIMJmsZA6nC0670eG6cUfj7nw1ixsCpCQFfDuiIfRntsh22E-5hNeqwctPhvuYf7jjdpYlL8IMwUVWhuaCqKGPk9_Lr-9ci3oHUEYg6EyAFkNLg8cXcCKRr7CnacEVNw0siAGyAiJjoavdU3NGN8U54aBIrfDXE8pU1baSchOniVFL9pusdpfuALnQw5ZDs8DDBzLoG8j2FofkT7PTU&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(8,NULL,'IntercityHotel Zürich Airport','Flughofstrasse 63, 8153 Rümlang, 瑞士','Switzerland','Zurich',NULL,NULL,'4.5',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpeQJlP9gwiC6vms_mvq0nLlDoSPvqs7t1AKqozGh08-l-IFW4RKZ6YUaJ3IyPpP1-yeI02os5qQTjJTTWhpw0RwgF2R8CRg7Bjp9_enKcBKVBO2isPGHLZsm1n2HnoI2U32vp206yDQH7RZohjVUsMqje_FWnxhgDm7J-9HHI8tV64jPpoCBykpnjRQP78sB0XLvMs_POp1m9wcHgnCIKpsGCWK1Nr3usct2Xn4a4kmvBF4GiFnuKGXpwyItWnPByzeJzMDuduC9-xpzX-ykScvaBDIKuyJ05T9Mx2bFV48EUfWwHc&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(9,NULL,'Hotel Swiss Night by Fassbind','Steinwiesstrasse 8, 8032 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4.2',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpdjeBlNAsDV4YDEbuXO1lBSrwZguXGI1Sx8SaL2_7fsmXwHyUObcS19QCCsZ2O7pC_jJ68-6-Rvyt6G8ctTpSzjJldpe9j-4jlnIMkWRexuqZZZ9IYXfDs5hu8ljJ8fOBZxN70u2WwcFXotgEtg7uolUJU9RCIdxQbCML_AhPjPAI3ax1RjQccZSy28gwo4BzVLzB8FGw_tGK7-n-iCxfaWS_SgfiD_boDpC5mPy4HAGN6AKIdHIF36izxSSqMPM7Tkg9VGOn1FmfgU0Tn-GqVyaoIWB6PXN4uVd_3p93OCvhOvs4I&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4'),(10,NULL,'Placid Hotel Zurich','Buckhauserstrasse 36, 8048 Zürich, 瑞士','Switzerland','Zurich',NULL,NULL,'4.2',NULL,NULL,'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATKogpcWRMc3DMzk_tokTuNiLcl2Isttfgmu2wel_OE8-BsBDVDAM-lhgNluYXkb8H2dtLzizHdhroJvnRWFVhmdGbtaptCUWQ7E2AK8SQ0SCeyinqivB5b66ZHNrgvcl8YVu8sEH0prS9dhZkyHsniE36h2hRXrnEFNPoEOlOVeh_yp_m5NWDup04JKlG6w90bVMC-z6NYANJvPGGW6ViHqa5eYJH_sYerz3W9ukgL29uomqoS6NhKPW5xpQvWeNg0wLkcOUW76ccA7TNHHA5Uf26azdUgKUjzWN8t8x95hrlbiiAum-4g&key=AIzaSyCwXETbilOh8JtpAkUPtiU5uyPK8ls0xu4');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
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
