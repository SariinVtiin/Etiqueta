CREATE DATABASE  IF NOT EXISTS `etiquetas_hospital` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `etiquetas_hospital`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: etiquetas_hospital
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `acrescimos`
--

DROP TABLE IF EXISTS `acrescimos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acrescimos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_item` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_medida` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantidade_referencia` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `data_importacao` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ativo` (`ativo`),
  KEY `idx_data_importacao` (`data_importacao`),
  KEY `idx_nome_item` (`nome_item`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acrescimos`
--

LOCK TABLES `acrescimos` WRITE;
/*!40000 ALTER TABLE `acrescimos` DISABLE KEYS */;
INSERT INTO `acrescimos` VALUES (1,'Açúcar sachê','Unid','sachê',0.15,0,'2026-01-15 10:00:00','2026-02-05 17:26:28'),(2,'Café','Porção','50ml',2.50,0,'2026-01-15 10:00:00','2026-02-05 17:26:28'),(3,'Abacate','Porção','120g',2.06,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(4,'Abacaxi','Porção','120g',1.43,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(5,'Achocolatado em pó','Porção','50g',4.37,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(6,'Açúcar sachê','Unid','sachê',0.15,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(7,'Adoçante sachê','Unid','sachê',0.43,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(8,'Água de coco','Unid.','200ml',7.28,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(9,'Água mineral sem gás','Garrafa','500ml Copo ',3.36,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(10,'Ameixa fresca','Porção','120g',5.37,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(11,'Ameixa seca','Porção','120g',18.79,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(12,'Arroz carreteiro ','Porção','500g',21.50,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(13,'Arroz doce','Porção','300g',3.73,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(14,'Arroz preparado','Porção','200g',0.76,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(15,'Azeite sachê','Unid','sachê',0.94,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(16,'Banana (maçã ou prata)','Porção','120g',1.49,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(17,'Biscoito água','Porção','100g',15.80,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(18,'Biscoito de queijo','Porção','100g',7.38,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(19,'Biscoito diversos em sachê (9 a 13 g)','Unid.','sachê',1.06,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(20,'Biscoito doce ou salgado (sachê)','Porção','100g',1.07,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(21,'Biscoito integral (sachê)','Unid.','sachê',1.65,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(22,'Bolo com cobertura','Porção','100g',9.67,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(23,'Bolo integral','Porção','100g',8.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(24,'Bolo simples','Porção','100g',8.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(25,'Café – c/ açúcar ou adoçante','Porção','200ml',0.75,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(26,'Café com leite – c/ açúcar ou adoçante','Porção','200ml',2.75,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(27,'Caixa de chá ','Caixa ',NULL,136.70,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(28,'Caldo de carne / frango  ou legumes','Porção','300ml ',10.96,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(29,'Caldo de carne/ frango ou legumes','Porção','500ml',9.79,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(30,'Caldo de legumes coado','Porção','400ml',5.99,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(31,'Canjica','Porção','300g',3.53,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(32,'Caqui','Porção','120g',3.28,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(33,'Carne preparada (porção extra)','Porção','130g',9.32,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(34,'Casadinho','Porção','100g',10.44,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(35,'Chá de ervas c/ açúcar ou adoçante preparado','Porção','200ml',0.72,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(36,'Coquetel Laxante (aveia, laranja, mamão, ameixa seca)','Porção','200ml',1.89,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(37,'Creme de frutas com leite','Porção','120g',1.89,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(38,'Creme de frutas sem leite','Porção','120g',1.89,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(39,'Cuscuz preparado','Porção','150g',0.87,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(40,'Farelo de aveia ','Porção','50g',1.12,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(41,'Farinha – Neston / Farinha láctea / Mucilon milho/ Mucilon M. Cereais/ Maisena ','Porção','50g',2.70,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(42,'Farinha de mandioca','Porção','50g',0.50,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(43,'Farofa preparada','Porção','100g',1.17,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(44,'Feijão preparado','Porção','100g',1.17,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(45,'Feijão tropeiro ','Porção','300g',0.96,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(46,'Filé de peixe preparado','Porção','130g',10.53,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(47,'Frango preparado (coxa e sobrecoxa)','Porção','150g',5.10,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(48,'Galinhada','Porção500g',NULL,2.32,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(49,'Gelatina dietética preparada','Porção','50g',0.21,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(50,'Gelatina preparada','Porção','50g',0.21,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(51,'Geleia de frutas em sachê','Unid.','sachê 15g',1.17,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(52,'Geleia dietética em sachê','Unid.','sachê 15g',1.17,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(53,'Gelo 4kg','Pacote',NULL,16.16,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(54,'Goiaba','Porção','120g',1.24,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(55,'Granola','Unid.','sachê 50g',3.86,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(56,'Granola diet/light ','Unid.','sachê 50g',3.85,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(57,'Iogurte de frutas','Unid.','120g',9.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(58,'Iogurte de soja','Unid.','180g',22.24,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(59,'Iogurte desnatado','Unid.','200ml',11.81,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(60,'Iogurte dietético / light','Unid.','180ml',9.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(61,'Iogurte natural','Unid.','180ml',9.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(62,'Iogurte sem lactose ','Unid ','120g',11.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(63,'Laranja','Porção','120g',0.89,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(64,'Laranja lima','Porção','120g',1.83,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(65,'Lasanha bolonhesa','Porção','500g',13.17,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(66,'Lasanha frango','Porção 500g',NULL,10.59,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(67,'Leite achocolatado reconstituído','Porção','200ml',3.78,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(68,'Leite de arroz','Porção','200ml',2.98,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(69,'Leite de vaca com baixo teor de lactose ','Porção','200ml',2.48,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(70,'Leite Desnatado c/ ou s/ açucar','Porção','200ml',1.88,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(71,'Leite Integral c/ ou s/ açucar','Porção','200ml',2.48,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(72,'Leite Soja c/ ou s/ açucar','Porção','200ml',2.73,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(73,'Limão','Porção','120g',0.89,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(74,'Maçã','Porçã','120g',2.56,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(75,'Macarrão alho e óleo ou macarronada a bolonhesa','Porção','500g',12.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(76,'Macarrão cozido ou macarronada sem glúten ','Porção','300g',2.73,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(77,'Mamão','Porção','120g',1.40,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(78,'Manga ','Porção','120g',1.48,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(79,'Manteiga com e sem sal','Sachê',NULL,1.52,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(80,'Maracujá','Porçã','120g',1.55,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(81,'Mel sachê','Unid.','Unid.',1.67,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(82,'Melancia','Porçã','200g',0.70,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(83,'Melão','Porção','120g',1.39,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(84,'Milk shake ','Porção','250ml',2.92,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(85,'Mingau com leite e diferentes farinhas/cereais ( mucilon / farinha láctea / maisena/ neston/ aveia) ','Porção','200ml',1.99,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(86,'Morango','Porção','120g',4.85,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(87,'Omelete com legumes ','Porção','180g',2.16,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(88,'Omelete com recheio ( queijo/ presunto/ tomate)','Porção','180g',3.16,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(89,'Omelete sem recheio','Porção','150g',1.47,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(90,'Ovo frito, cozido, quente ou pochê','Unid.','Unid.',1.37,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(91,'Panqueca de carne ','Porção','180g',8.75,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(92,'Panqueca de frango','Porção','180g',8.13,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(93,'Pão brioche','Porção','50g',1.54,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(94,'Pão brioche integral ','Porção','50g',1.54,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(95,'Pão de forma','Porção','50g',1.24,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(96,'Pão de forma integral','Unid.','50g',1.28,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(97,'Pão de queijo','Unid','100g',2.98,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(98,'Pão francês / doce / careca','Porção','50g',1.54,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(99,'Pão sem gluten','Porção','50g',1.54,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(100,'Pêra','Porção','120g',2.98,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(101,'Peta','Porção','100g',1.62,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(102,'Petit four','Porção','120g',12.68,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(103,'Picolé ','Unid.','Unid.',2.98,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(104,'Pipoca ','Porção','100g',0.80,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(105,'Pizza (sabores)','Porção','100g',6.96,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(106,'Pocan ','Porção','120g',0.99,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(107,'Presunto','Porção','50g',4.10,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(108,'Presunto de peru ','Porção','50g',4.60,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(109,'Proteína de soja ','Porção','100g',7.08,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(110,'Pudim diet','Porção','80g',3.47,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(111,'Queijo Cottage','Porção','50g',7.45,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(112,'Queijo Minas','Porção50g',NULL,3.59,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(113,'Queijo Minas frescal ','Porção','50g',3.59,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(114,'Queijo Muçarela','Porção','50g',3.34,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(115,'Queijo Ricota','Porção','50g',3.35,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(116,'Requeijão (sachê)','Unid.','Unid.',7.64,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(117,'Sal (sachê)','Unid- sachê',NULL,0.17,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(118,'Salada de Frutas','Porção','120g',2.05,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(119,'Salgados assado ( esfirra de carne/frango, enroladinho queijo, pão pizza, enroladinho Romeu e Julieta)','Unid ',' 100g',6.21,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(120,'Sanduíche Blanquet peru/queijo mussarela','Unid.','Unid.',6.64,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(121,'Sanduíche carne/frango-100g','Unid.','Unid.',7.58,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(122,'Sanduíche com Hambúrguer - 100g','Unid.','Unid.',7.08,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(123,'Sanduíche Natural','Unid.','Unid.',5.39,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(124,'Sanduíche queijo, presunto, ','Unid.','Unid.',7.08,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(125,'Sequilhos','Porção','100g',2.61,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(126,'Sobremesa paciente (doce/fruta)','Porção','80g',1.67,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(127,'Sopa com carne/frango e legumes sem macarrão 300ml','Porção','300ml',10.39,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(128,'Sopa com carne/frango e legumes sem macarrão 500ml','Porção','500ml',17.32,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(129,'Sopa com carne/frango, macarrão e legumes 300ml','Porção','300ml',10.07,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(130,'Sopa com carne/frango, macarrão e legumes 500ml','Porção','500ml',16.78,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(131,'Sopa com legumes sem proteína 300ml','Porção','300ml',2.49,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(132,'Sopa com legumes sem proteína 500ml','Porção','500ml',4.14,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(133,'Sopa/ Canja (com frango desfiado)','Porção','300ml',10.39,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(134,'Sopa/ Canja (com frango desfiado)','Porção','500ml',17.31,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(135,'Sorvete','Porção','100g',2.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(136,'Suco de Frutas - Natural c/ ou s/ açucar','Porção','200ml',1.64,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(137,'Suco de Frutas - Polpa c/ ou s/ açucar','Porção','200ml',1.13,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(138,'Suco de Frutas c/ Vegetais c/ ou s/ açucar','Porção','200ml',1.13,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(139,'Suco de frutas tetra-pack ','Unid.','200ml',3.60,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(140,'Suco de frutas tetra-pack diet','Unid.','200ml',3.60,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(141,'Suco Light Lata','Unid','335ml',8.08,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(142,'Sucrilhos','Porção','50g',5.30,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(143,'Tapioca com manteiga','Porção','100g',1.59,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(144,'Tapioca com recheio ( queijo e manteiga)','Porção','100g',2.81,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(145,'Torrada em sachê','Unid.','sachê',1.97,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(146,'Torrada integral em sachê','Unid.','sachê',1.96,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(147,'Uva','Porção','120g',4.06,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(148,'Vegetais A,B,C crus (salada extra)','Porção','100g',1.23,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(149,'Vegetais A,B,C prep.(purê de legumes)','Porção','100g',1.62,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(150,'Vinagrete','Porção','50g',1.69,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(151,'Vinagrete sachê','Cx.','210 unid.',292.73,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(152,'Vitamina  de frutas preparada c/ leite','Porção','200ml',1.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(153,'Tapioca doce ','Porção','200ml',2.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(154,'Tapioca com Polenguinho ','Porção','200ml',3.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(155,'Polenguinho ','Porção','200ml',4.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(156,'Líquida de prova ','Porção','200ml',5.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(157,'Fruta porção ','Porção','200ml',6.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(158,'Papa de frutas ','Porção','200ml',7.91,1,'2026-02-06 11:17:19','2026-02-06 14:17:18'),(159,'Papa de legumes',NULL,NULL,0.00,1,'2026-02-06 11:17:19','2026-02-06 14:17:18');
/*!40000 ALTER TABLE `acrescimos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backup_prescricoes_acompanhante_20260316`
--

DROP TABLE IF EXISTS `backup_prescricoes_acompanhante_20260316`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backup_prescricoes_acompanhante_20260316` (
  `id` int NOT NULL DEFAULT '0',
  `cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_atendimento` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `convenio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_paciente` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_mae` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_nascimento` date NOT NULL,
  `idade` int NOT NULL,
  `nucleo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `leito` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_alimentacao` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dieta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `restricoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sem_principal` tinyint(1) DEFAULT '0',
  `descricao_sem_principal` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `obs_exclusao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `obs_acrescimo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `acrescimos_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'IDs dos acréscimos selecionados, separados por vírgula',
  `itens_especiais_ids` json DEFAULT NULL,
  `tem_acompanhante` tinyint(1) DEFAULT '0',
  `tipo_acompanhante` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acompanhante_refeicoes` json DEFAULT NULL,
  `acompanhante_restricoes_ids` json DEFAULT NULL,
  `acompanhante_obs_livre` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Ativo',
  `data_prescricao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` int DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup_prescricoes_acompanhante_20260316`
--

LOCK TABLES `backup_prescricoes_acompanhante_20260316` WRITE;
/*!40000 ALTER TABLE `backup_prescricoes_acompanhante_20260316` DISABLE KEYS */;
INSERT INTO `backup_prescricoes_acompanhante_20260316` VALUES (2,'044.107.801-07','9898989','Particular','Lara ','Maria ','2008-06-26',17,'INTERNAÇÃO','609','Almoço','NORMAL ADULTO','[]',1,'Macarrão','s/ arroz',NULL,'[135]','[]',1,'adulto','[\"Almoço\", \"Janta\"]','[]',NULL,'Ativo','2026-03-12 00:00:00',1,'2026-03-11 11:24:37','2026-03-11 11:24:37'),(5,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'UTI ADULTO','550','Almoço','NORMAL ADULTO','[]',0,NULL,NULL,NULL,'[8]','[]',1,'adulto','[\"Almoço\"]','[]',NULL,'Ativo','2026-03-16 00:00:00',1,'2026-03-15 11:45:52','2026-03-15 11:45:52'),(6,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'UTI ADULTO','550','Colação','NORMAL ADULTO','[]',0,NULL,NULL,NULL,'[4]','[]',1,'adulto','[\"Almoço\"]','[]',NULL,'Ativo','2026-03-16 00:00:00',1,'2026-03-15 11:45:52','2026-03-15 11:45:52');
/*!40000 ALTER TABLE `backup_prescricoes_acompanhante_20260316` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias_substituicao_principal`
--

DROP TABLE IF EXISTS `categorias_substituicao_principal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_substituicao_principal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `ordem` int DEFAULT '999',
  `ativa` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_substituicao_principal`
--

LOCK TABLES `categorias_substituicao_principal` WRITE;
/*!40000 ALTER TABLE `categorias_substituicao_principal` DISABLE KEYS */;
INSERT INTO `categorias_substituicao_principal` VALUES (1,'Arroz',1,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(2,'Feijão',2,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(3,'Carne',3,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(4,'Frango',4,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(5,'Peixe',5,1,'2026-03-22 01:20:20','2026-03-22 01:20:20');
/*!40000 ALTER TABLE `categorias_substituicao_principal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condicoes_nutricionais`
--

DROP TABLE IF EXISTS `condicoes_nutricionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicoes_nutricionais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ativa` tinyint(1) DEFAULT '1',
  `ordem` int DEFAULT '0',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`),
  KEY `idx_ativa` (`ativa`),
  KEY `idx_ordem` (`ordem`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condicoes_nutricionais`
--

LOCK TABLES `condicoes_nutricionais` WRITE;
/*!40000 ALTER TABLE `condicoes_nutricionais` DISABLE KEYS */;
INSERT INTO `condicoes_nutricionais` VALUES (1,'HPS','Hiposódica',0,1,'2026-02-12 17:02:38','2026-03-18 01:51:31'),(2,'HPGX','Hipograxa',0,20,'2026-02-12 17:02:38','2026-03-18 01:51:35'),(3,'LAX','Laxativa',0,3,'2026-02-12 17:02:38','2026-02-27 22:38:07'),(4,'OBT','Obstipante',0,4,'2026-02-12 17:02:38','2026-02-27 22:37:50'),(5,'DM','Diabetes Mellitus',0,5,'2026-02-12 17:02:38','2026-02-27 22:37:46'),(6,'IRC','Insuficiência Renal Crônica',0,6,'2026-02-12 17:02:38','2026-02-27 22:37:54'),(7,'CRUS','Crua',0,7,'2026-02-12 17:02:38','2026-02-27 22:38:03'),(8,'Pediatria','Restrições Pediátricas',0,8,'2026-02-12 17:02:38','2026-02-27 22:38:11'),(9,'Restrita a Vitamina K','Restrição de Vitamina K',0,9,'2026-02-12 17:02:38','2026-02-27 22:37:59'),(10,'TESTE','TESTE',0,10,'2026-02-14 13:38:02','2026-02-27 22:38:14');
/*!40000 ALTER TABLE `condicoes_nutricionais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condicoes_nutricionais_acompanhante`
--

DROP TABLE IF EXISTS `condicoes_nutricionais_acompanhante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicoes_nutricionais_acompanhante` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `ativa` tinyint(1) DEFAULT '1',
  `ordem` int DEFAULT '999',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condicoes_nutricionais_acompanhante`
--

LOCK TABLES `condicoes_nutricionais_acompanhante` WRITE;
/*!40000 ALTER TABLE `condicoes_nutricionais_acompanhante` DISABLE KEYS */;
INSERT INTO `condicoes_nutricionais_acompanhante` VALUES (1,'Diabético','Acompanhante com diabetes',0,1,'2026-02-21 23:48:46','2026-03-14 13:33:17'),(2,'Intolerante a Lactose','Acompanhante com intolerância à lactose',0,2,'2026-02-21 23:48:46','2026-02-23 13:44:44'),(3,'Sem Glúten','Acompanhante celíaco ou com restrição a glúten',0,3,'2026-02-21 23:48:46','2026-02-23 13:44:41'),(4,'Hipertenso','Acompanhante com hipertensão',0,4,'2026-02-21 23:48:46','2026-02-23 13:44:48');
/*!40000 ALTER TABLE `condicoes_nutricionais_acompanhante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracoes`
--

DROP TABLE IF EXISTS `configuracoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chave` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chave` (`chave`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracoes`
--

LOCK TABLES `configuracoes` WRITE;
/*!40000 ALTER TABLE `configuracoes` DISABLE KEYS */;
INSERT INTO `configuracoes` VALUES (1,'hora_corte','09:00','Horário de corte para cálculo de data de consumo das refeições','2026-02-22 10:32:09');
/*!40000 ALTER TABLE `configuracoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convenios`
--

DROP TABLE IF EXISTS `convenios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convenios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativa` tinyint(1) DEFAULT '1',
  `ordem` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convenios`
--

LOCK TABLES `convenios` WRITE;
/*!40000 ALTER TABLE `convenios` DISABLE KEYS */;
INSERT INTO `convenios` VALUES (1,'SUS',NULL,1,1,'2026-03-04 10:27:42','2026-03-04 10:27:42'),(2,'Convênio',NULL,1,2,'2026-03-04 10:27:42','2026-03-04 10:27:42'),(3,'Particular',NULL,1,3,'2026-03-04 10:27:42','2026-03-04 10:52:20'),(4,'Amil','Teste',0,4,'2026-03-04 10:52:39','2026-03-11 13:39:48');
/*!40000 ALTER TABLE `convenios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dietas`
--

DROP TABLE IF EXISTS `dietas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dietas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alias_faturamento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ativa` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dietas`
--

LOCK TABLES `dietas` WRITE;
/*!40000 ALTER TABLE `dietas` DISABLE KEYS */;
INSERT INTO `dietas` VALUES (1,'NORMAL ADULTO','NOR','NORMAL ADULTO','Dieta normal sem restrições',1,'2026-01-28 15:04:42','2026-03-15 14:09:01'),(2,'LÍQUIDA ','LIQ.','LIQUIDA','Dieta líquida completa',1,'2026-01-28 15:04:42','2026-03-15 14:09:01'),(3,'PASTOSA','PAST','LIQUIDA PASTOSA','Dieta pastosa',0,'2026-01-28 15:04:42','2026-03-15 14:09:01'),(4,'LIQ. PASTOSA ADULTO','LIQ.PAST','LIQUIDA PASTOSA','Dieta líquida pastosa',1,'2026-01-28 15:04:42','2026-03-15 14:09:01'),(5,'HIPOSSÓDICA','HPS',NULL,'Dieta com restrição de sódio',0,'2026-01-28 15:04:42','2026-02-19 17:29:58'),(6,'LIQ. PEDIATRIA 1  a  13 ANOS','PED2','NORMAL PEDIATRICA','Dieta pediátrica 1 a 13 ANOS',1,'2026-01-28 15:04:42','2026-03-15 14:09:01'),(7,'DIABETES MELLITUS','DM',NULL,'Dieta para diabéticos',0,'2026-01-28 15:04:42','2026-02-19 20:34:46'),(8,'LAXANTE','LAX',NULL,'Alimentação laxante ',0,'2026-02-06 20:11:08','2026-02-19 17:30:08'),(9,'IRC','IRC',NULL,'Alimentação hipocalêmica, hipossódica e hipoprotéica',0,'2026-02-06 20:11:36','2026-02-19 17:30:05'),(10,'OBSTIPANTE ','OBST',NULL,'DIETA OBSTIPANTE ',0,'2026-02-06 20:14:51','2026-02-19 17:30:27'),(12,'LÍQUIDA MR','MR','LIQUIDA','Dieta mínima de resíduos ',0,'2026-02-14 15:33:17','2026-03-15 14:09:01'),(13,'LÍQUIDA DE PROVA','LIQ.PROV.','LIQUIDA','Dieta líquida de prova ',1,'2026-02-14 15:36:29','2026-03-15 14:09:01'),(14,'LIQ. PEDIATRIA 6 a  12 MESES','PED1','NORMAL PEDIATRICA','Dieta pediátrica 6 a 12 MESES',1,'2026-02-14 15:40:40','2026-03-15 14:09:01');
/*!40000 ALTER TABLE `dietas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faturamento_itens`
--

DROP TABLE IF EXISTS `faturamento_itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faturamento_itens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescricao_id` int NOT NULL,
  `versao` int NOT NULL DEFAULT '1',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `data_consumo` date NOT NULL,
  `data_geracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paciente_nome` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `paciente_cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_atendimento` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `convenio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nucleo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leito` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_item` enum('refeicao_paciente','acrescimo','lactario','acompanhante') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_refeicao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dieta_original` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chave_dieta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia_id` int DEFAULT NULL,
  `referencia_nome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantidade` decimal(10,2) NOT NULL DEFAULT '1.00',
  `valor_unitario` decimal(12,4) NOT NULL DEFAULT '0.0000',
  `valor_total` decimal(12,4) NOT NULL DEFAULT '0.0000',
  `status` enum('cobrado','pendente_preco','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cobrado',
  `detalhe_json` json DEFAULT NULL,
  `cancelado_em` datetime DEFAULT NULL,
  `motivo_cancelamento` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_faturamento_prescricao` (`prescricao_id`),
  KEY `idx_faturamento_data_consumo` (`data_consumo`),
  KEY `idx_faturamento_paciente` (`paciente_nome`),
  KEY `idx_faturamento_cpf` (`paciente_cpf`),
  KEY `idx_faturamento_nucleo` (`nucleo`),
  KEY `idx_faturamento_tipo_item` (`tipo_item`),
  KEY `idx_faturamento_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faturamento_itens`
--

LOCK TABLES `faturamento_itens` WRITE;
/*!40000 ALTER TABLE `faturamento_itens` DISABLE KEYS */;
INSERT INTO `faturamento_itens` VALUES (1,1,1,1,'2026-03-12','2026-03-15 13:08:42','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','UDT','12','refeicao_paciente','Desjejum','LÍQUIDA ','LIQUIDA',NULL,'Refeição paciente - Desjejum',1.00,12.7147,12.7147,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LÍQUIDA \", \"tabela_preco_id\": 11}',NULL,NULL,'2026-03-15 16:08:42'),(2,1,1,1,'2026-03-12','2026-03-15 13:08:42','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','UDT','12','acrescimo','Desjejum','LÍQUIDA ',NULL,5,'Achocolatado em pó',1.00,4.3700,4.3700,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"50g\"}',NULL,NULL,'2026-03-15 16:08:42'),(3,2,1,1,'2026-03-12','2026-03-15 13:08:42','Lara ','044.107.801-07','9898989','Particular','INTERNAÇÃO','609','refeicao_paciente','Almoço','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Almoço',1.00,33.6731,33.6731,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 1}',NULL,NULL,'2026-03-15 16:08:42'),(4,2,1,1,'2026-03-12','2026-03-15 13:08:42','Lara ','044.107.801-07','9898989','Particular','INTERNAÇÃO','609','acrescimo','Almoço','NORMAL ADULTO',NULL,135,'Sorvete',1.00,2.9100,2.9100,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"100g\"}',NULL,NULL,'2026-03-15 16:08:42'),(5,2,1,1,'2026-03-12','2026-03-15 13:08:42','Lara ','044.107.801-07','9898989','Particular','INTERNAÇÃO','609','acompanhante','Almoço','NORMAL ADULTO','NORMAL ACOMPANHANTE',NULL,'Acompanhante - Almoço',1.00,29.3756,29.3756,'cobrado','{\"tabela_preco_id\": 29, \"tipo_acompanhante\": \"adulto\"}',NULL,NULL,'2026-03-15 16:08:42'),(6,3,1,1,'2026-03-15','2026-03-15 13:08:42','Lara ','044.107.801-07','9898989','Particular','INTERNAÇÃO','615','refeicao_paciente','Almoço','LIQ. PASTOSA ADULTO','LIQUIDA PASTOSA',NULL,'Refeição paciente - Almoço',1.00,32.5458,32.5458,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PASTOSA ADULTO\", \"tabela_preco_id\": 15}',NULL,NULL,'2026-03-15 16:08:42'),(7,4,1,1,'2026-03-15','2026-03-15 13:08:42','Lara ','044.107.801-07','9898989','Particular','INTERNAÇÃO','610','refeicao_paciente','Colação','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Colação',1.00,3.9557,3.9557,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 3}',NULL,NULL,'2026-03-15 16:08:42'),(8,5,1,1,'2026-03-16','2026-03-15 13:08:42','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','refeicao_paciente','Almoço','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Almoço',1.00,33.6731,33.6731,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 1}',NULL,NULL,'2026-03-15 16:08:42'),(9,5,1,1,'2026-03-16','2026-03-15 13:08:42','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','acrescimo','Almoço','NORMAL ADULTO',NULL,8,'Água de coco',1.00,7.2800,7.2800,'cobrado','{\"tipo_medida\": \"Unid.\", \"quantidade_referencia\": \"200ml\"}',NULL,NULL,'2026-03-15 16:08:42'),(10,5,1,1,'2026-03-16','2026-03-15 13:08:42','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','acompanhante','Almoço','NORMAL ADULTO','NORMAL ACOMPANHANTE',NULL,'Acompanhante - Almoço',1.00,29.3756,29.3756,'cobrado','{\"tabela_preco_id\": 29, \"tipo_acompanhante\": \"adulto\"}',NULL,NULL,'2026-03-15 16:08:42'),(11,6,1,1,'2026-03-16','2026-03-15 13:08:42','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','refeicao_paciente','Colação','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Colação',1.00,3.9557,3.9557,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 3}',NULL,NULL,'2026-03-15 16:08:42'),(12,6,1,1,'2026-03-16','2026-03-15 13:08:42','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','acrescimo','Colação','NORMAL ADULTO',NULL,4,'Abacaxi',1.00,1.4300,1.4300,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}',NULL,NULL,'2026-03-15 16:08:42'),(13,7,1,1,'2026-03-18','2026-03-17 12:15:31','José Alencar Silva Bastista ','325.411.871-23','1578943','SUS','UTI ADULTO','546','refeicao_paciente','Desjejum','LIQ. PASTOSA ADULTO','LIQUIDA PASTOSA',NULL,'Refeição paciente - Desjejum',1.00,12.7147,12.7147,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PASTOSA ADULTO\", \"tabela_preco_id\": 18}',NULL,NULL,'2026-03-17 15:15:31'),(14,7,1,1,'2026-03-18','2026-03-17 12:15:31','José Alencar Silva Bastista ','325.411.871-23','1578943','SUS','UTI ADULTO','546','acrescimo','Desjejum','LIQ. PASTOSA ADULTO',NULL,26,'Café com leite – c/ açúcar ou adoçante',1.00,2.7500,2.7500,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"200ml\"}',NULL,NULL,'2026-03-17 15:15:31'),(15,7,1,1,'2026-03-18','2026-03-17 12:15:31','José Alencar Silva Bastista ','325.411.871-23','1578943','SUS','UTI ADULTO','546','acrescimo','Desjejum','LIQ. PASTOSA ADULTO',NULL,37,'Creme de frutas com leite',1.00,1.8900,1.8900,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}',NULL,NULL,'2026-03-17 15:15:31'),(16,7,1,1,'2026-03-18','2026-03-17 12:15:31','José Alencar Silva Bastista ','325.411.871-23','1578943','SUS','UTI ADULTO','546','acompanhante','Desjejum','LIQ. PASTOSA ADULTO','NORMAL ACOMPANHANTE',NULL,'Acompanhante - Desjejum',1.00,8.9664,8.9664,'cobrado','{\"tabela_preco_id\": 30, \"tipo_acompanhante\": \"adulto\"}',NULL,NULL,'2026-03-17 15:15:31'),(17,8,1,0,'2026-03-22','2026-03-21 13:00:04','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','INTERNAÇÃO','607','refeicao_paciente','Colação','LIQ. PEDIATRIA 6 a  12 MESES','NORMAL PEDIATRICA',NULL,'Refeição paciente - Colação',1.00,3.9353,3.9353,'cancelado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PEDIATRIA 6 a  12 MESES\", \"tabela_preco_id\": 24}','2026-03-21 13:01:05','Reprocessado após alteração da prescrição','2026-03-21 16:00:04'),(18,8,1,0,'2026-03-22','2026-03-21 13:00:04','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','INTERNAÇÃO','607','acrescimo','Colação','LIQ. PEDIATRIA 6 a  12 MESES',NULL,5,'Achocolatado em pó',1.00,4.3700,4.3700,'cancelado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"50g\"}','2026-03-21 13:01:05','Reprocessado após alteração da prescrição','2026-03-21 16:00:04'),(19,8,2,0,'2026-03-22','2026-03-21 13:01:05','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','INTERNAÇÃO','607','refeicao_paciente','Colação','LIQ. PEDIATRIA 6 a  12 MESES','NORMAL PEDIATRICA',NULL,'Refeição paciente - Colação',1.00,3.9353,3.9353,'cancelado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PEDIATRIA 6 a  12 MESES\", \"tabela_preco_id\": 24}','2026-03-21 13:01:29','Reprocessado após alteração da prescrição','2026-03-21 16:01:05'),(20,8,2,0,'2026-03-22','2026-03-21 13:01:05','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','INTERNAÇÃO','607','acrescimo','Colação','LIQ. PEDIATRIA 6 a  12 MESES',NULL,4,'Abacaxi',1.00,1.4300,1.4300,'cancelado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}','2026-03-21 13:01:29','Reprocessado após alteração da prescrição','2026-03-21 16:01:05'),(21,8,2,0,'2026-03-22','2026-03-21 13:01:05','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','INTERNAÇÃO','607','acrescimo','Colação','LIQ. PEDIATRIA 6 a  12 MESES',NULL,5,'Achocolatado em pó',1.00,4.3700,4.3700,'cancelado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"50g\"}','2026-03-21 13:01:29','Reprocessado após alteração da prescrição','2026-03-21 16:01:05'),(22,8,3,1,'2026-03-22','2026-03-21 13:01:29','Vitor Carvalho Fernandes','072.409.411-32','7888221','SUS','INTERNAÇÃO','607','refeicao_paciente','Colação','LIQ. PEDIATRIA 6 a  12 MESES','NORMAL PEDIATRICA',NULL,'Refeição paciente - Colação',1.00,3.9353,3.9353,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PEDIATRIA 6 a  12 MESES\", \"tabela_preco_id\": 24}',NULL,NULL,'2026-03-21 16:01:29'),(23,9,1,1,'2026-03-22','2026-03-21 18:47:52','Bel Carvalho ','886.853.061-91','1111111','SUS','INTERNAÇÃO','601','refeicao_paciente','Almoço','LÍQUIDA ','LIQUIDA',NULL,'Refeição paciente - Almoço',1.00,32.5458,32.5458,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LÍQUIDA \", \"tabela_preco_id\": 8}',NULL,NULL,'2026-03-21 21:47:52'),(24,9,1,1,'2026-03-22','2026-03-21 18:47:52','Bel Carvalho ','886.853.061-91','1111111','SUS','INTERNAÇÃO','601','acrescimo','Almoço','LÍQUIDA ',NULL,54,'Goiaba',1.00,1.2400,1.2400,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}',NULL,NULL,'2026-03-21 21:47:52'),(25,10,1,1,'2026-03-22','2026-03-21 18:49:38','Bel Carvalho ','886.853.061-91','1111111','SUS','INTERNAÇÃO','601','refeicao_paciente','Jantar','LIQ. PASTOSA ADULTO','LIQUIDA PASTOSA',NULL,'Refeição paciente - Jantar',1.00,32.5458,32.5458,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PASTOSA ADULTO\", \"tabela_preco_id\": 19}',NULL,NULL,'2026-03-21 21:49:38'),(26,10,1,1,'2026-03-22','2026-03-21 18:49:38','Bel Carvalho ','886.853.061-91','1111111','SUS','INTERNAÇÃO','601','acrescimo','Jantar','LIQ. PASTOSA ADULTO',NULL,6,'Açúcar sachê',1.00,0.1500,0.1500,'cobrado','{\"tipo_medida\": \"Unid\", \"quantidade_referencia\": \"sachê\"}',NULL,NULL,'2026-03-21 21:49:38'),(27,11,1,1,'2026-03-22','2026-03-21 21:00:54','Maura Araújo ','124.578.940-45','1234567','Convênio','TMO','301','refeicao_paciente','Merenda','LIQ. PEDIATRIA 6 a  12 MESES','NORMAL PEDIATRICA',NULL,'Refeição paciente - Merenda',1.00,11.2712,11.2712,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LIQ. PEDIATRIA 6 a  12 MESES\", \"tabela_preco_id\": 27}',NULL,NULL,'2026-03-22 00:00:54'),(28,11,1,1,'2026-03-22','2026-03-21 21:00:54','Maura Araújo ','124.578.940-45','1234567','Convênio','TMO','301','acrescimo','Merenda','LIQ. PEDIATRIA 6 a  12 MESES',NULL,8,'Água de coco',1.00,7.2800,7.2800,'cobrado','{\"tipo_medida\": \"Unid.\", \"quantidade_referencia\": \"200ml\"}',NULL,NULL,'2026-03-22 00:00:54'),(29,12,1,0,'2026-03-23','2026-03-22 12:50:56','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','INTERNAÇÃO','615','refeicao_paciente','Almoço','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Almoço',1.00,33.6731,33.6731,'cancelado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 1}','2026-03-22 12:52:17','Reprocessado após alteração da prescrição','2026-03-22 15:50:56'),(30,12,2,1,'2026-03-23','2026-03-22 12:52:17','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','INTERNAÇÃO','615','refeicao_paciente','Almoço','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Almoço',1.00,33.6731,33.6731,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 1}',NULL,NULL,'2026-03-22 15:52:17'),(31,12,2,1,'2026-03-23','2026-03-22 12:52:17','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','INTERNAÇÃO','615','acrescimo','Almoço','NORMAL ADULTO',NULL,3,'Abacate',1.00,2.0600,2.0600,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}',NULL,NULL,'2026-03-22 15:52:17'),(32,12,2,1,'2026-03-23','2026-03-22 12:52:17','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','INTERNAÇÃO','615','acrescimo','Almoço','NORMAL ADULTO',NULL,4,'Abacaxi',1.00,1.4300,1.4300,'cobrado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}',NULL,NULL,'2026-03-22 15:52:17'),(33,13,1,0,'2026-03-23','2026-03-22 12:56:32','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','refeicao_paciente','Merenda','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Merenda',1.00,10.6983,10.6983,'cancelado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 6}','2026-03-22 12:57:58','Reprocessado após alteração da prescrição','2026-03-22 15:56:32'),(34,13,2,0,'2026-03-23','2026-03-22 12:57:58','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','refeicao_paciente','Merenda','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Merenda',1.00,10.6983,10.6983,'cancelado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 6}','2026-03-22 13:03:03','Prescrição excluída pelo usuário','2026-03-22 15:57:58'),(35,13,2,0,'2026-03-23','2026-03-22 12:57:58','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','acrescimo','Merenda','NORMAL ADULTO',NULL,3,'Abacate',1.00,2.0600,2.0600,'cancelado','{\"tipo_medida\": \"Porção\", \"quantidade_referencia\": \"120g\"}','2026-03-22 13:03:03','Prescrição excluída pelo usuário','2026-03-22 15:57:58'),(36,14,1,1,'2026-03-23','2026-03-22 13:00:27','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','refeicao_paciente','Colação','LÍQUIDA ','LIQUIDA',NULL,'Refeição paciente - Colação',1.00,5.4257,5.4257,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"LÍQUIDA \", \"tabela_preco_id\": 10}',NULL,NULL,'2026-03-22 16:00:27'),(37,15,1,1,'2026-03-23','2026-03-22 13:00:27','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','refeicao_paciente','Almoço','NORMAL ADULTO','NORMAL ADULTO',NULL,'Refeição paciente - Almoço',1.00,33.6731,33.6731,'cobrado','{\"origem\": \"tabela_precos_refeicao\", \"dieta_original\": \"NORMAL ADULTO\", \"tabela_preco_id\": 1}',NULL,NULL,'2026-03-22 16:00:27'),(38,15,1,1,'2026-03-23','2026-03-22 13:00:27','Alex Maxwel Alves Cardoso','067.066.521-56','9098765','Convênio','UTI ADULTO','550','acompanhante','Almoço','NORMAL ADULTO','NORMAL ACOMPANHANTE',NULL,'Acompanhante - Almoço',1.00,29.3756,29.3756,'cobrado','{\"tabela_preco_id\": 29, \"tipo_acompanhante\": \"adulto\"}',NULL,NULL,'2026-03-22 16:00:27');
/*!40000 ALTER TABLE `faturamento_itens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_refeicao_especial`
--

DROP TABLE IF EXISTS `itens_refeicao_especial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_refeicao_especial` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refeicao_id` int NOT NULL,
  `versao_id` int NOT NULL,
  `produto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gramatura` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT '0.00',
  `ativo` tinyint(1) DEFAULT '1',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `versao_id` (`versao_id`),
  KEY `idx_itens_refeicao_especial_refeicao` (`refeicao_id`,`ativo`),
  CONSTRAINT `itens_refeicao_especial_ibfk_1` FOREIGN KEY (`refeicao_id`) REFERENCES `tipos_refeicao` (`id`),
  CONSTRAINT `itens_refeicao_especial_ibfk_2` FOREIGN KEY (`versao_id`) REFERENCES `versoes_itens_refeicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_refeicao_especial`
--

LOCK TABLES `itens_refeicao_especial` WRITE;
/*!40000 ALTER TABLE `itens_refeicao_especial` DISABLE KEYS */;
INSERT INTO `itens_refeicao_especial` VALUES (1,7,1,'Aptamil 1','Unid/800g',82.67,1,'2026-02-20 01:35:26'),(2,7,1,'Aptamil 1','Unid/400g',43.99,1,'2026-02-20 01:35:26'),(3,7,1,'Cubitan ( chocolate / baunilha)','Unid/200ml',36.95,1,'2026-02-20 01:35:26'),(4,7,1,'Fiber Mais','Unid./260g',134.21,1,'2026-02-20 01:35:26'),(5,7,1,'Fortini em pó sem sabor','Unid/400g',118.26,1,'2026-02-20 01:35:26'),(6,7,1,'Fresubin Protein Energy  Drink (vários sabores)','Unid/200ml',37.28,1,'2026-02-20 01:35:26'),(7,7,1,'Fresubin Protein Powder','Unid/300g',198.06,1,'2026-02-20 01:35:26'),(8,7,1,'Glutamina','Unid/300g',7.40,1,'2026-02-20 01:35:26'),(9,7,1,'Infatrini (pó)','Unid./400g',243.56,1,'2026-02-20 01:35:26'),(10,7,1,'Leite Ninho','Unid./400g',33.55,1,'2026-02-20 01:35:26'),(11,7,1,'Leite Ninho Zero Lactose','Unid./400g',37.28,1,'2026-02-20 01:35:26'),(12,7,1,'Maltodextrina','Unid/400g',58.68,1,'2026-02-20 01:35:26'),(13,7,1,'Leite desnatado (pó)','Unid./600g',37.28,1,'2026-02-20 01:35:26'),(14,7,1,'Leite sem lactose (pó)','Unid./260g',52.19,1,'2026-02-20 01:35:26'),(15,7,1,'Mucilon de milho','Unid/400g',24.23,1,'2026-02-20 01:35:26'),(16,7,1,'Mucilon Multicereais','Unid/400g',24.23,1,'2026-02-20 01:35:26'),(17,7,1,'Nan 1 Pro','Unid/400g',31.04,1,'2026-02-20 01:35:26'),(18,7,1,'Nan AR','Unid/400g',43.81,1,'2026-02-20 01:35:26'),(19,7,1,'Neo advanced','Unid/400g',298.25,1,'2026-02-20 01:35:26'),(20,7,1,'Neocate LCP','Unid/400g',436.09,1,'2026-02-20 01:35:26'),(21,7,1,'Nestogeno 2','Unid/400g',91.32,1,'2026-02-20 01:35:26'),(22,7,1,'Nutren Control','Unid/200ml',25.15,1,'2026-02-20 01:35:26'),(23,7,1,'Novasource GI Control Enteral Sistema Fechado','Unid./1L',135.76,1,'2026-02-20 01:35:26'),(24,7,1,'Nutren Active','Unid/400g',74.56,1,'2026-02-20 01:35:26'),(25,7,1,'Nutren Kids pó','Unid/400g',60.56,1,'2026-02-20 01:35:26'),(26,7,1,'Nutrison Energy 1.5 Enteral Sistema Fechado','Unid./1L',73.37,1,'2026-02-20 01:35:26'),(27,7,1,'Pediasure Baunilha/Chocolate','Unid/400g',191.23,1,'2026-02-20 01:35:26'),(28,7,1,'Peptamen 1.5 Enteral Sistema fechado','Unid/1L',187.15,1,'2026-02-20 01:35:26'),(29,7,1,'Peptamen Jr pó baunilha','Unid/400g',368.62,1,'2026-02-20 01:35:26'),(30,7,1,'Pregomin Pepti','Unid/400g',194.79,1,'2026-02-20 01:35:26'),(31,7,1,'TCM com AGE','Unid/250ml',180.85,1,'2026-02-20 01:35:26'),(32,7,1,'Thicken up clear','Unid./125g',86.68,1,'2026-02-20 01:35:26');
/*!40000 ALTER TABLE `itens_refeicao_especial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_substituicao_principal`
--

DROP TABLE IF EXISTS `itens_substituicao_principal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_substituicao_principal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `ordem` int DEFAULT '999',
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categoria_nome` (`categoria_id`,`nome`),
  CONSTRAINT `itens_substituicao_principal_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_substituicao_principal` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_substituicao_principal`
--

LOCK TABLES `itens_substituicao_principal` WRITE;
/*!40000 ALTER TABLE `itens_substituicao_principal` DISABLE KEYS */;
INSERT INTO `itens_substituicao_principal` VALUES (1,1,'Branco',1,1,'2026-03-22 01:20:20','2026-03-22 03:50:34'),(2,1,'integral',2,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(3,2,'preto',1,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(4,2,'carioca',2,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(5,3,'cozida',1,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(6,3,'bife',2,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(7,3,'cubos',3,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(8,3,'grelhada',4,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(9,3,'assada',5,1,'2026-03-22 01:20:20','2026-03-22 01:20:20'),(15,4,'cozido',1,1,'2026-03-22 01:22:49','2026-03-22 01:22:49'),(16,4,'cubos',2,1,'2026-03-22 01:22:49','2026-03-22 01:22:49'),(17,4,'bife',3,1,'2026-03-22 01:22:49','2026-03-22 01:22:49'),(18,4,'grelhado',4,1,'2026-03-22 01:22:49','2026-03-22 01:22:49'),(19,5,'cozido',1,1,'2026-03-22 01:22:49','2026-03-22 01:22:49'),(20,5,'grelhado',2,1,'2026-03-22 01:22:49','2026-03-22 01:22:49'),(21,2,'Tropeiro',3,1,'2026-03-22 04:14:48','2026-03-22 04:14:59');
/*!40000 ALTER TABLE `itens_substituicao_principal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leitos`
--

DROP TABLE IF EXISTS `leitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leitos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `setor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `andar` int DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero` (`numero`),
  KEY `idx_numero` (`numero`),
  KEY `idx_setor` (`setor`)
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leitos`
--

LOCK TABLES `leitos` WRITE;
/*!40000 ALTER TABLE `leitos` DISABLE KEYS */;
INSERT INTO `leitos` VALUES (1,'601','INTERNAÇÃO',6,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(2,'602','INTERNAÇÃO',6,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(3,'603','INTERNAÇÃO',6,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(4,'501','UTI PEDIÁTRICA',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(5,'502','UTI PEDIÁTRICA',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(6,'541','UTI ADULTO',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(7,'542','UTI ADULTO',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(8,'1','UDT',1,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(9,'2','UDT',1,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(10,'301','TMO',3,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(11,'302','TMO',3,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(73,'604','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(74,'605','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(75,'606','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(76,'607','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(77,'608','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(78,'609','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-02-14 16:18:11'),(79,'610','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-02-18 22:30:17'),(80,'611','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(81,'612','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(82,'613','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(83,'614','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(84,'615','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(85,'616','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(86,'617','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(87,'618','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(88,'619','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(89,'620','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(90,'621','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(91,'622','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(92,'623','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(93,'624','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(94,'625','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(95,'626','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(96,'627','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(97,'628','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(98,'629','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(99,'630','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-03-14 13:12:45'),(100,'631','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-03-14 13:12:40'),(101,'632','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(102,'633','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(103,'634','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(104,'635','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(105,'636','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(106,'637','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(107,'638','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(108,'639','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(109,'640','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(110,'641','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-02-14 16:18:08'),(111,'642','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(112,'643','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(113,'644','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(114,'645','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(115,'646','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(116,'647','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(117,'648','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(118,'649','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(119,'650','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(120,'651','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(121,'652','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(122,'653','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(123,'654','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(124,'655','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(125,'656','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(126,'657','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(127,'658','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(128,'659','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(129,'660','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(130,'661','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(131,'503','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(132,'504','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(133,'505','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(134,'506','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(135,'507','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(136,'508','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(137,'509','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(138,'510','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(139,'511','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(140,'512','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(141,'513','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(142,'514','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(143,'515','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(144,'543','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(145,'544','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(146,'545','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(147,'546','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(148,'547','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(149,'548','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(150,'549','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(151,'550','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(152,'551','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(153,'552','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(154,'553','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(155,'554','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(156,'555','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(157,'556','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-02-19 17:01:20'),(158,'3','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(159,'4','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(160,'5','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(161,'6','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(162,'7','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(163,'8','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(164,'9','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(165,'10','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(166,'11','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(167,'12','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(168,'13','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(169,'14','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(170,'15','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(171,'16','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(172,'17','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(173,'18','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(174,'303','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(175,'304','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(176,'305','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(177,'306','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(178,'307','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(179,'308','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(180,'309','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(181,'310','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(182,'311','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(183,'312','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(184,'313','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(185,'314','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(186,'662','INTERNAÇÃO',6,0,'2026-02-20 14:48:49','2026-02-20 14:48:55'),(187,'1001','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(188,'1002','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(189,'1003','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(190,'1004','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(191,'1005','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(192,'1006','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(193,'1007','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(194,'1008','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(195,'1009','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(196,'1010','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20');
/*!40000 ALTER TABLE `leitos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_login`
--

DROP TABLE IF EXISTS `logs_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `usuario_nome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_tentado` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_evento` enum('LOGIN_SUCESSO','LOGIN_FALHA_SENHA','LOGIN_FALHA_EMAIL','LOGIN_FALHA_INATIVO','LOGIN_FALHA_RATE_LIMIT','LOGOUT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tipo_evento` (`tipo_evento`),
  KEY `idx_email_tentado` (`email_tentado`),
  KEY `idx_usuario_id` (`usuario_id`),
  KEY `idx_criado_em` (`criado_em`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_periodo_tipo` (`criado_em`,`tipo_evento`),
  CONSTRAINT `fk_logs_login_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_login`
--

LOCK TABLES `logs_login` WRITE;
/*!40000 ALTER TABLE `logs_login` DISABLE KEYS */;
INSERT INTO `logs_login` VALUES (1,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-14 23:17:53'),(2,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-14 23:19:39'),(3,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 01:28:43'),(4,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 01:28:46'),(5,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 21:59:39'),(6,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 21:59:44'),(7,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 22:11:38'),(8,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 22:11:43'),(9,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 22:12:08'),(10,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0','2026-02-15 22:53:58'),(11,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 23:12:31'),(12,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:21:59'),(13,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:22:09'),(14,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:30:09'),(15,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:30:28'),(16,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:32:26'),(17,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:38:02'),(18,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:39:14'),(19,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:47:52'),(20,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 13:54:51'),(21,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 13:55:09'),(22,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 14:14:18'),(23,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 14:14:57'),(24,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 15:31:39'),(25,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 15:31:52'),(26,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 15:56:09'),(27,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 16:05:21'),(28,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-16 21:19:07'),(29,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 18:12:30'),(30,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 18:24:32'),(31,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:20:22'),(32,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:20:34'),(33,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:22:34'),(34,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15','2026-02-18 22:28:20'),(35,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:28:28'),(36,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:39:37'),(37,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:41:50'),(38,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 23:10:00'),(39,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 01:27:15'),(40,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 16:57:27'),(41,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 17:31:10'),(42,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 17:32:04'),(43,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 17:32:09'),(44,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 20:34:24'),(45,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 20:34:28'),(46,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-19 21:14:32'),(47,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-19 21:29:45'),(48,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-19 21:29:48'),(49,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 21:34:08'),(50,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 21:51:32'),(51,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 21:51:36'),(52,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-20 01:30:45'),(53,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-20 01:40:12'),(54,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-20 01:49:59'),(55,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 11:06:28'),(56,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 12:09:54'),(57,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 12:23:33'),(58,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:191.58.137.190','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/145.0.7632.108 Mobile/15E148 Safari/604.1','2026-02-20 16:19:42'),(59,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 17:55:51'),(60,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:187.84.190.206','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-21 02:04:29'),(61,NULL,NULL,NULL,'nutri1@hospital.com.br','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:187.84.190.206','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-21 02:12:09'),(62,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:187.84.190.206','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-21 02:12:15'),(63,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 15:42:20'),(64,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 15:42:29'),(65,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:43:36'),(66,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:43:46'),(67,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:56:49'),(68,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:56:55'),(69,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15','2026-02-21 22:12:16'),(70,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 22:12:23'),(71,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 00:37:52'),(72,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-22 03:17:11'),(73,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:08:05'),(74,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:08:30'),(75,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:24:51'),(76,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:32:16'),(77,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:32:20'),(78,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:57:44'),(79,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:57:49'),(80,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:59:03'),(81,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:59:08'),(82,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 14:05:35'),(83,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 16:07:16'),(84,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-22 16:22:21'),(85,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 16:54:55'),(86,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 21:55:54'),(87,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 21:57:16'),(88,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 23:27:57'),(89,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 23:28:16'),(90,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 23:31:47'),(91,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-22 23:34:17'),(92,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 23:55:04'),(93,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 00:21:58'),(94,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 00:25:05'),(95,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 00:25:20'),(96,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 02:17:39'),(97,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 11:42:11'),(98,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 11:42:26'),(99,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 12:02:57'),(100,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 12:04:09'),(101,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 12:04:20'),(102,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:104.28.63.103','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1','2026-02-23 12:08:05'),(103,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 13:29:41'),(104,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 14:07:41'),(105,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.174.223.74','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36','2026-02-23 18:26:44'),(106,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 00:23:14'),(107,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 00:23:19'),(108,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 00:32:23'),(109,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 00:38:39'),(110,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 10:33:47'),(111,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 10:41:15'),(112,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 10:41:19'),(113,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 10:59:20'),(114,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-24 16:22:52'),(115,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-27 20:29:38'),(116,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:191.38.53.143','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-02 14:10:48'),(117,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-04 01:14:32'),(118,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-04 01:23:28'),(119,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-04 01:26:01'),(120,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 02:00:13'),(121,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-04 02:04:13'),(122,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-04 10:51:03'),(123,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:149.19.175.228','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 11:59:50'),(124,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-06 19:22:16'),(125,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36','2026-03-10 20:04:55'),(126,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','2026-03-10 22:28:17'),(127,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-10 22:38:31'),(128,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-10 22:51:33'),(129,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-10 22:51:39'),(130,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-10 22:51:49'),(131,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-10 22:51:58'),(132,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-10 23:02:47'),(133,NULL,NULL,NULL,'admin@empresa.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 01:45:10'),(134,NULL,NULL,NULL,'admin@empresa.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 01:45:15'),(135,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 01:45:21'),(136,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36','2026-03-11 01:50:25'),(137,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.19','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 02:44:33'),(138,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.19','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 02:50:40'),(139,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 11:39:10'),(140,NULL,NULL,NULL,'confederaltablet@gmail.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 11:43:58'),(141,NULL,NULL,NULL,'confederaltablet@gmail.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 11:44:05'),(142,NULL,NULL,NULL,'confederaltablet@gmail.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 11:44:11'),(143,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 11:44:21'),(144,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 12:22:35'),(145,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 12:30:35'),(146,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 12:31:20'),(147,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 12:31:24'),(148,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 12:31:27'),(149,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 12:49:37'),(150,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:191.38.53.10','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:17:53'),(151,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:18:18'),(152,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:18:35'),(153,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:19:16'),(154,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:20:37'),(155,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:37:06'),(156,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:38:48'),(157,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:57:40'),(158,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 14:46:42'),(159,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 18:21:14'),(160,NULL,NULL,NULL,'admin@empresa.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 19:40:43'),(161,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 19:41:00'),(162,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/145.0.7632.108 Mobile/15E148 Safari/604.1','2026-03-11 22:15:51'),(163,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-12 16:10:13'),(164,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-12 16:10:43'),(165,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-12 16:11:04'),(166,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-03-14 13:05:19'),(167,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-14 19:36:50'),(168,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-15 14:35:58'),(169,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-15 14:36:15'),(170,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 01:08:39'),(171,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 01:08:41'),(172,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 01:08:53'),(173,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 01:09:19'),(174,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 01:09:22'),(175,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 01:10:06'),(176,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36','2026-03-16 01:12:23'),(177,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36','2026-03-16 01:13:29'),(178,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36','2026-03-16 01:14:03'),(179,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36','2026-03-16 01:14:25'),(180,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36','2026-03-16 01:14:51'),(181,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36','2026-03-16 01:16:33'),(182,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15','2026-03-16 01:29:13'),(183,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/145.0.7632.108 Mobile/15E148 Safari/604.1','2026-03-16 10:35:39'),(184,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/145.0.7632.108 Mobile/15E148 Safari/604.1','2026-03-16 11:00:06'),(185,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 14:01:05'),(186,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 14:37:24'),(187,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 14:53:41'),(188,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 14:53:47'),(189,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 14:54:56'),(190,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 14:55:01'),(191,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 15:19:00'),(192,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 15:19:27'),(193,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 15:28:53'),(194,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 15:29:00'),(195,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/146.0.7680.40 Mobile/15E148 Safari/604.1','2026-03-16 15:59:08'),(196,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/146.0.7680.40 Mobile/15E148 Safari/604.1','2026-03-16 15:59:20'),(197,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 19:07:02'),(198,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 19:16:32'),(199,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 19:25:33'),(200,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 19:25:51'),(201,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 19:43:21'),(202,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-16 19:43:33'),(203,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/146.0.7680.40 Mobile/15E148 Safari/604.1','2026-03-16 19:51:43'),(204,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 11:07:15'),(205,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 11:28:46'),(206,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 11:28:52'),(207,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 11:42:54'),(208,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0','2026-03-17 15:10:32'),(209,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 15:20:56'),(210,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 22:23:06'),(211,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-18 01:26:19'),(212,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-18 01:52:57'),(213,NULL,NULL,NULL,'admin@empresa.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-18 02:27:51'),(214,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-18 02:27:57'),(215,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 10:29:59'),(216,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 15:24:37'),(217,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-19 13:23:56'),(218,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-19 14:10:29'),(219,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-19 17:02:30'),(220,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-20 16:05:52'),(221,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 12:12:58'),(222,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 15:37:11'),(223,5,'bel','bel@gmail.com','bel@gmail.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 21:40:43'),(224,5,'bel','bel@gmail.com','Bel@gmail.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 23:55:57'),(225,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-22 00:49:52'),(226,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 01:08:05'),(227,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0','2026-03-22 03:21:12'),(228,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:21:27'),(229,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:33:39'),(230,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:33:43'),(231,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:33:56'),(232,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:34:01'),(233,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:39:31'),(234,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 03:49:51'),(235,NULL,NULL,NULL,'admin@empresa.com','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-22 03:55:13'),(236,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-22 03:55:22'),(237,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/146.0.7680.151 Mobile/15E148 Safari/604.1','2026-03-22 04:03:28'),(238,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 11:33:52'),(239,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 11:33:57'),(240,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 12:01:43'),(241,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 12:11:53'),(242,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0','2026-03-22 12:55:04'),(243,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 13:30:24'),(244,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 15:50:12'),(245,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 20:54:45'),(246,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 20:54:56');
/*!40000 ALTER TABLE `logs_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_paciente` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_atendimento` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `convenio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_mae` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `idade` int DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `prontuario` (`codigo_atendimento`),
  KEY `idx_prontuario` (`codigo_atendimento`),
  KEY `idx_cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'Vitor Carvalho Fernandes','7888221','07240941132','2026-03-11 12:31:08','2026-03-21 16:00:04','SUS','Teste Mãe ','2000-06-26',25,'2026-03-11 12:31:08','2026-03-21 16:00:04'),(2,'Lara ','9898989','04410780107','2026-03-11 14:24:37','2026-03-14 20:41:56','Particular','Maria ','2008-06-26',17,'2026-03-11 14:24:37','2026-03-14 20:41:56'),(3,'Alex Maxwel Alves Cardoso','9098765','06706652156','2026-03-15 14:45:52','2026-03-22 16:00:27','Convênio','Karine Alves','2004-02-02',22,'2026-03-15 14:45:52','2026-03-22 16:00:27'),(5,'José Alencar Silva Bastista ','1578943','32541187123','2026-03-17 15:15:31','2026-03-17 15:15:31','SUS','Joana Maria Silva Batista ','1984-04-01',41,'2026-03-17 15:15:31','2026-03-17 15:15:31'),(6,'Bel Carvalho ','1111111','88685306191','2026-03-21 21:47:52','2026-03-21 21:49:38','SUS','Maria Neves','1974-09-28',51,'2026-03-21 21:47:52','2026-03-21 21:49:38'),(7,'Maura Araújo ','1234567','12457894045','2026-03-22 00:00:54','2026-03-22 00:00:54','Convênio','Marta','1970-03-10',56,'2026-03-22 00:00:54','2026-03-22 00:00:54');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescricoes`
--

DROP TABLE IF EXISTS `prescricoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescricoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_atendimento` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `convenio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_paciente` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_mae` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_nascimento` date NOT NULL,
  `idade` int NOT NULL,
  `nucleo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `leito` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_alimentacao` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dieta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `restricoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sem_principal` tinyint(1) DEFAULT '0',
  `descricao_sem_principal` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `substituicao_principal_ids` json DEFAULT NULL,
  `obs_exclusao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `obs_acrescimo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `acrescimos_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'IDs dos acréscimos selecionados, separados por vírgula',
  `itens_especiais_ids` json DEFAULT NULL,
  `tem_acompanhante` tinyint(1) DEFAULT '0',
  `tipo_acompanhante` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acompanhante_refeicoes` json DEFAULT NULL,
  `acompanhante_restricoes_ids` json DEFAULT NULL,
  `acompanhante_obs_livre` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Ativo',
  `data_prescricao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` int DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cpf` (`cpf`),
  KEY `idx_leito` (`leito`),
  KEY `idx_data` (`data_prescricao`),
  KEY `idx_status` (`status`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_prescricoes_acompanhante` (`tem_acompanhante`),
  CONSTRAINT `prescricoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Armazena todas as prescrições de alimentação dos pacientes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescricoes`
--

LOCK TABLES `prescricoes` WRITE;
/*!40000 ALTER TABLE `prescricoes` DISABLE KEYS */;
INSERT INTO `prescricoes` VALUES (1,'072.409.411-32','7888221','SUS','Vitor Carvalho Fernandes','Teste Mãe ','2000-06-27',25,'UDT','12','Desjejum','LÍQUIDA ','[\"HPS\"]',1,'peito de frango',NULL,NULL,NULL,'[5]',NULL,0,NULL,'[]','[]',NULL,'Ativo','2026-03-12 00:00:00',1,'2026-03-11 09:31:08','2026-03-11 11:32:17'),(2,'044.107.801-07','9898989','Particular','Lara ','Maria ','2008-06-26',17,'INTERNAÇÃO','609','Almoço','NORMAL ADULTO','[]',1,'Macarrão',NULL,'s/ arroz',NULL,'[135]','[]',1,'adulto','[\"Almoço\"]','[]',NULL,'Ativo','2026-03-12 00:00:00',1,'2026-03-11 11:24:37','2026-03-15 13:05:42'),(3,'044.107.801-07','9898989','Particular','Lara ','Maria ','2008-06-26',17,'INTERNAÇÃO','615','Almoço','LIQ. PASTOSA ADULTO','[]',0,NULL,NULL,NULL,NULL,'[]','[]',0,NULL,'[]','[]',NULL,'Ativo','2026-03-15 00:00:00',1,'2026-03-14 17:40:25','2026-03-14 17:40:25'),(4,'044.107.801-07','9898989','Particular','Lara ','Maria ','2008-06-26',17,'INTERNAÇÃO','610','Colação','NORMAL ADULTO','[]',0,NULL,NULL,NULL,NULL,'[]','[]',0,NULL,'[]','[]',NULL,'Ativo','2026-03-15 00:00:00',1,'2026-03-14 17:41:56','2026-03-14 17:41:56'),(5,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'UTI ADULTO','550','Almoço','NORMAL ADULTO','[]',0,NULL,NULL,NULL,NULL,'[8]','[]',1,'adulto','[\"Almoço\"]','[]',NULL,'Ativo','2026-03-16 00:00:00',1,'2026-03-15 11:45:52','2026-03-15 11:45:52'),(6,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'UTI ADULTO','550','Colação','NORMAL ADULTO','[]',0,NULL,NULL,NULL,NULL,'[4]','[]',0,NULL,'[]',NULL,NULL,'Ativo','2026-03-16 00:00:00',1,'2026-03-15 11:45:52','2026-03-15 13:05:42'),(7,'325.411.871-23','1578943','SUS','José Alencar Silva Bastista ','Joana Maria Silva Batista ','1984-04-01',41,'UTI ADULTO','546','Desjejum','LIQ. PASTOSA ADULTO','[\"HPGX\"]',1,'Tapioca com geleia ',NULL,NULL,NULL,'[37,26]',NULL,1,'adulto','[\"Desjejum\"]',NULL,'Diesta Normal','Ativo','2026-03-18 00:00:00',1,'2026-03-17 12:15:31','2026-03-17 12:15:31'),(8,'072.409.411-32','7888221','SUS','Vitor Carvalho Fernandes','Teste Mãe ','2000-06-28',25,'INTERNAÇÃO','607','Colação','LIQ. PEDIATRIA 6 a  12 MESES','[]',0,NULL,NULL,NULL,NULL,'[]',NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-03-22 00:00:00',1,'2026-03-21 13:00:04','2026-03-21 13:01:29'),(9,'886.853.061-91','1111111','SUS','Bel Carvalho ','Maria Neves','1974-09-28',51,'INTERNAÇÃO','601','Almoço','LÍQUIDA ','[]',0,NULL,NULL,NULL,NULL,'[54]',NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-03-22 00:00:00',5,'2026-03-21 18:47:52','2026-03-21 18:47:52'),(10,'886.853.061-91','1111111','SUS','Bel Carvalho ','Maria Neves','1974-09-28',51,'INTERNAÇÃO','601','Jantar','LIQ. PASTOSA ADULTO','[]',0,NULL,NULL,NULL,NULL,'[6]',NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-03-22 00:00:00',5,'2026-03-21 18:49:38','2026-03-21 18:49:38'),(11,'124.578.940-45','1234567','Convênio','Maura Araújo ','Marta','1970-03-10',56,'TMO','301','Merenda','LIQ. PEDIATRIA 6 a  12 MESES','[]',0,NULL,NULL,NULL,NULL,'[8]',NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-03-22 00:00:00',5,'2026-03-21 21:00:54','2026-03-21 21:00:54'),(12,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'INTERNAÇÃO','615','Almoço','NORMAL ADULTO','[]',0,NULL,NULL,NULL,NULL,'[3,4]',NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-03-23 00:00:00',1,'2026-03-22 12:50:56','2026-03-22 12:52:17'),(14,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'UTI ADULTO','550','Colação','LÍQUIDA ','[]',0,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-03-23 00:00:00',1,'2026-03-22 13:00:27','2026-03-22 13:00:27'),(15,'067.066.521-56','9098765','Convênio','Alex Maxwel Alves Cardoso','Karine Alves','2004-02-02',22,'UTI ADULTO','550','Almoço','NORMAL ADULTO','[]',0,NULL,NULL,NULL,NULL,NULL,NULL,1,'adulto','[\"Almoço\"]',NULL,NULL,'Ativo','2026-03-23 00:00:00',1,'2026-03-22 13:00:27','2026-03-22 13:00:27');
/*!40000 ALTER TABLE `prescricoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_em` datetime NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `revogado` tinyint(1) DEFAULT '0',
  `revogado_em` datetime DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_token` (`token`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_expiracao` (`expira_em`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Armazena refresh tokens para renovação automática de sessão';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabela_precos_refeicao`
--

DROP TABLE IF EXISTS `tabela_precos_refeicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabela_precos_refeicao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria` enum('paciente','acompanhante') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'paciente',
  `chave_dieta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_refeicao_id` int NOT NULL,
  `valor` decimal(12,4) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `observacao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_preco_refeicao` (`categoria`,`chave_dieta`,`tipo_refeicao_id`),
  KEY `idx_preco_categoria` (`categoria`),
  KEY `idx_preco_chave` (`chave_dieta`),
  KEY `idx_preco_tipo_refeicao` (`tipo_refeicao_id`),
  CONSTRAINT `fk_tabela_precos_refeicao_tipo_refeicao` FOREIGN KEY (`tipo_refeicao_id`) REFERENCES `tipos_refeicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabela_precos_refeicao`
--

LOCK TABLES `tabela_precos_refeicao` WRITE;
/*!40000 ALTER TABLE `tabela_precos_refeicao` DISABLE KEYS */;
INSERT INTO `tabela_precos_refeicao` VALUES (1,'paciente','NORMAL ADULTO',3,33.6731,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(2,'paciente','NORMAL ADULTO',6,10.6983,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(3,'paciente','NORMAL ADULTO',2,3.9557,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(4,'paciente','NORMAL ADULTO',1,12.0891,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(5,'paciente','NORMAL ADULTO',5,33.6731,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(6,'paciente','NORMAL ADULTO',4,10.6983,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(8,'paciente','LIQUIDA',3,32.5458,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(9,'paciente','LIQUIDA',6,8.8525,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(10,'paciente','LIQUIDA',2,5.4257,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(11,'paciente','LIQUIDA',1,12.7147,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(12,'paciente','LIQUIDA',5,32.5458,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(13,'paciente','LIQUIDA',4,20.4656,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(15,'paciente','LIQUIDA PASTOSA',3,32.5458,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(16,'paciente','LIQUIDA PASTOSA',6,8.8525,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(17,'paciente','LIQUIDA PASTOSA',2,5.4257,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(18,'paciente','LIQUIDA PASTOSA',1,12.7147,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(19,'paciente','LIQUIDA PASTOSA',5,32.5458,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(20,'paciente','LIQUIDA PASTOSA',4,20.4656,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(22,'paciente','NORMAL PEDIATRICA',3,30.9708,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(23,'paciente','NORMAL PEDIATRICA',6,11.2712,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(24,'paciente','NORMAL PEDIATRICA',2,3.9353,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(25,'paciente','NORMAL PEDIATRICA',1,12.8298,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(26,'paciente','NORMAL PEDIATRICA',5,30.9708,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(27,'paciente','NORMAL PEDIATRICA',4,11.2712,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(29,'acompanhante','NORMAL ACOMPANHANTE',3,29.3756,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(30,'acompanhante','NORMAL ACOMPANHANTE',1,8.9664,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01'),(31,'acompanhante','NORMAL ACOMPANHANTE',5,21.2819,1,'Carga inicial importada do esboço de faturamento','2026-03-15 14:09:01','2026-03-15 14:09:01');
/*!40000 ALTER TABLE `tabela_precos_refeicao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_acompanhante`
--

DROP TABLE IF EXISTS `tipos_acompanhante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_acompanhante` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emoji` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ordem` int NOT NULL DEFAULT '0',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tipos_acompanhante_codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_acompanhante`
--

LOCK TABLES `tipos_acompanhante` WRITE;
/*!40000 ALTER TABLE `tipos_acompanhante` DISABLE KEYS */;
INSERT INTO `tipos_acompanhante` VALUES (1,'adulto','Adulto','Acompanhante adulto','?',1,1,'2026-03-22 16:26:54','2026-03-22 16:26:54'),(2,'crianca','Criança','Acompanhante criança','?',2,1,'2026-03-22 16:26:54','2026-03-22 16:26:54'),(3,'idoso','Idoso','Acompanhante idoso','?',3,0,'2026-03-22 16:26:54','2026-03-22 18:36:49'),(16,'gestante','Gestante',NULL,'?',4,0,'2026-03-22 17:46:52','2026-03-22 17:52:55');
/*!40000 ALTER TABLE `tipos_acompanhante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_acompanhante_refeicoes`
--

DROP TABLE IF EXISTS `tipos_acompanhante_refeicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_acompanhante_refeicoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_acompanhante_id` int NOT NULL,
  `tipo_refeicao_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tipo_acomp_ref` (`tipo_acompanhante_id`,`tipo_refeicao_id`),
  KEY `fk_ta_ref_tipo_ref` (`tipo_refeicao_id`),
  CONSTRAINT `fk_ta_ref_tipo_acomp` FOREIGN KEY (`tipo_acompanhante_id`) REFERENCES `tipos_acompanhante` (`id`),
  CONSTRAINT `fk_ta_ref_tipo_ref` FOREIGN KEY (`tipo_refeicao_id`) REFERENCES `tipos_refeicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_acompanhante_refeicoes`
--

LOCK TABLES `tipos_acompanhante_refeicoes` WRITE;
/*!40000 ALTER TABLE `tipos_acompanhante_refeicoes` DISABLE KEYS */;
INSERT INTO `tipos_acompanhante_refeicoes` VALUES (2,1,1),(1,1,3),(3,1,5),(7,2,1),(6,2,2),(4,2,3),(9,2,4),(8,2,5),(5,2,6),(14,3,1),(13,3,2),(11,3,3),(16,3,4),(15,3,5),(12,3,6),(18,16,2),(19,16,3);
/*!40000 ALTER TABLE `tipos_acompanhante_refeicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_refeicao`
--

DROP TABLE IF EXISTS `tipos_refeicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_refeicao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ordem` int DEFAULT '999',
  `ativa` tinyint(1) DEFAULT '1',
  `tem_lista_personalizada` tinyint(1) DEFAULT '0',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `grupo_dia` enum('atual','proximo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'proximo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_refeicao`
--

LOCK TABLES `tipos_refeicao` WRITE;
/*!40000 ALTER TABLE `tipos_refeicao` DISABLE KEYS */;
INSERT INTO `tipos_refeicao` VALUES (1,'Desjejum',NULL,1,1,0,'2026-02-19 20:53:58','2026-02-21 22:12:36','atual'),(2,'Colação',NULL,2,1,0,'2026-02-19 20:53:58','2026-02-21 22:13:13','atual'),(3,'Almoço',NULL,3,1,0,'2026-02-19 20:53:58','2026-02-21 22:13:17','atual'),(4,'Merenda',NULL,4,1,0,'2026-02-19 20:53:58','2026-02-21 22:13:25','atual'),(5,'Jantar',NULL,5,1,0,'2026-02-19 20:53:58','2026-02-21 22:13:21','atual'),(6,'Ceia',NULL,6,1,0,'2026-02-19 20:53:58','2026-02-21 22:13:30','atual'),(7,'Form. Enteral',NULL,7,1,1,'2026-02-19 21:26:01','2026-02-20 01:46:41','proximo');
/*!40000 ALTER TABLE `tipos_refeicao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','nutricionista') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'nutricionista',
  `crn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissoes` json DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `ultimo_login` timestamp NULL DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@hospital.com','$2b$10$4W2dw4x5by6c3CP2pKjVfeTt7Blk998DpQjszEpzDWeV7APAon1dm','admin',NULL,NULL,1,'2026-03-22 15:50:12','2026-01-29 18:41:10','2026-03-22 15:50:12'),(2,'Nutricionista 1','nutri1@hospital.com','$2b$10$4W2dw4x5by6c3CP2pKjVfeTt7Blk998DpQjszEpzDWeV7APAon1dm','nutricionista','CRN-1 12345','[\"dashboard\", \"cadastros\", \"cadastros_configuracoes\"]',1,'2026-03-22 20:54:56','2026-01-29 18:41:10','2026-03-22 20:54:56'),(3,'Nutricionista 2','nutri2@hospital.com','$2b$10$4W2dw4x5by6c3CP2pKjVfeTt7Blk998DpQjszEpzDWeV7APAon1dm','nutricionista','CRN-1 12346','[\"dashboard\", \"prescricoes\", \"nova_prescricao\", \"pacientes\", \"cadastros\", \"cadastros_usuarios\", \"cadastros_leitos\", \"cadastros_dietas\", \"cadastros_condicoes\", \"cadastros_condicoes_acompanhante\", \"cadastros_refeicoes\", \"cadastros_acrescimos\", \"cadastros_configuracoes\", \"cadastros_convenios\", \"cadastros_logs\"]',1,NULL,'2026-01-29 18:41:10','2026-03-16 01:48:22'),(4,'Vitor  C','vitor@gmail.com','$2b$10$qCn2b1SXZjc8MAwm/rIVLuwgZCOM.yFMWkQld74wBKGwBEEZr10sW','admin',NULL,NULL,1,'2026-01-30 22:20:50','2026-01-30 22:12:56','2026-03-21 15:37:19'),(5,'bel','bel@gmail.com','$2b$10$6QIlCyuLIy9FpuudVvCSIuuLdcA4lv1X804ixwI89IEfOmCpDb5hS','admin',NULL,NULL,1,'2026-03-21 23:55:57','2026-03-21 21:40:11','2026-03-21 23:55:57');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `versoes_itens_refeicao`
--

DROP TABLE IF EXISTS `versoes_itens_refeicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `versoes_itens_refeicao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refeicao_id` int NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_itens` int DEFAULT '0',
  `ativa` tinyint(1) DEFAULT '1',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_versoes_refeicao` (`refeicao_id`,`ativa`),
  CONSTRAINT `versoes_itens_refeicao_ibfk_1` FOREIGN KEY (`refeicao_id`) REFERENCES `tipos_refeicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `versoes_itens_refeicao`
--

LOCK TABLES `versoes_itens_refeicao` WRITE;
/*!40000 ALTER TABLE `versoes_itens_refeicao` DISABLE KEYS */;
INSERT INTO `versoes_itens_refeicao` VALUES (1,7,'import.xlsx',32,1,'2026-02-20 01:35:26');
/*!40000 ALTER TABLE `versoes_itens_refeicao` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-22 18:00:55
