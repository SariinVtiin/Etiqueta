CREATE DATABASE  IF NOT EXISTS `etiquetas_hospital` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `etiquetas_hospital`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: etiquetas_hospital
-- ------------------------------------------------------
-- Server version	8.0.44

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
  `nome_item` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_medida` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantidade_referencia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Table structure for table `condicoes_nutricionais`
--

DROP TABLE IF EXISTS `condicoes_nutricionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicoes_nutricionais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
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
INSERT INTO `condicoes_nutricionais` VALUES (1,'HPS','Hiposódica',1,1,'2026-02-12 17:02:38','2026-02-12 17:02:38'),(2,'HPGX','Hipograxa',1,20,'2026-02-12 17:02:38','2026-02-19 18:25:00'),(3,'LAX','Laxativa',1,3,'2026-02-12 17:02:38','2026-02-19 17:32:43'),(4,'OBT','Obstipante',1,4,'2026-02-12 17:02:38','2026-02-19 18:23:34'),(5,'DM','Diabetes Mellitus',1,5,'2026-02-12 17:02:38','2026-02-19 17:32:40'),(6,'IRC','Insuficiência Renal Crônica',1,6,'2026-02-12 17:02:38','2026-02-19 18:24:44'),(7,'CRUS','Crua',1,7,'2026-02-12 17:02:38','2026-02-19 18:24:47'),(8,'Pediatria','Restrições Pediátricas',1,8,'2026-02-12 17:02:38','2026-02-19 18:24:53'),(9,'Restrita a Vitamina K','Restrição de Vitamina K',1,9,'2026-02-12 17:02:38','2026-02-19 18:24:59'),(10,'TESTE','TESTE',1,10,'2026-02-14 13:38:02','2026-02-19 18:24:59');
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
INSERT INTO `condicoes_nutricionais_acompanhante` VALUES (1,'Diabético','Acompanhante com diabetes',1,1,'2026-02-21 23:48:46','2026-02-21 23:48:46'),(2,'Intolerante a Lactose','Acompanhante com intolerância à lactose',1,2,'2026-02-21 23:48:46','2026-02-21 23:48:46'),(3,'Sem Glúten','Acompanhante celíaco ou com restrição a glúten',1,3,'2026-02-21 23:48:46','2026-02-21 23:48:46'),(4,'Hipertenso','Acompanhante com hipertensão',1,4,'2026-02-21 23:48:46','2026-02-21 23:48:46');
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
  `chave` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Table structure for table `dietas`
--

DROP TABLE IF EXISTS `dietas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dietas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
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
INSERT INTO `dietas` VALUES (1,'NORMAL ADULTO','NOR','Dieta normal sem restrições',1,'2026-01-28 15:04:42','2026-02-19 21:28:26'),(2,'LÍQUIDA ','LIQ.','Dieta líquida completa',1,'2026-01-28 15:04:42','2026-02-21 21:46:13'),(3,'PASTOSA','PAST','Dieta pastosa',0,'2026-01-28 15:04:42','2026-02-19 17:30:31'),(4,'LIQ. PASTOSA ADULTO','LIQ.PAST','Dieta líquida pastosa',1,'2026-01-28 15:04:42','2026-02-20 12:27:43'),(5,'HIPOSSÓDICA','HPS','Dieta com restrição de sódio',0,'2026-01-28 15:04:42','2026-02-19 17:29:58'),(6,'LIQ. PEDIATRIA 1  a  13 ANOS','PED2','Dieta pediátrica 1 a 13 ANOS',1,'2026-01-28 15:04:42','2026-02-20 12:28:01'),(7,'DIABETES MELLITUS','DM','Dieta para diabéticos',0,'2026-01-28 15:04:42','2026-02-19 20:34:46'),(8,'LAXANTE','LAX','Alimentação laxante ',0,'2026-02-06 20:11:08','2026-02-19 17:30:08'),(9,'IRC','IRC','Alimentação hipocalêmica, hipossódica e hipoprotéica',0,'2026-02-06 20:11:36','2026-02-19 17:30:05'),(10,'OBSTIPANTE ','OBST','DIETA OBSTIPANTE ',0,'2026-02-06 20:14:51','2026-02-19 17:30:27'),(12,'LÍQUIDA MR','MR','Dieta mínima de resíduos ',0,'2026-02-14 15:33:17','2026-02-19 17:30:20'),(13,'LÍQUIDA DE PROVA','LIQ.PROV.','Dieta líquida de prova ',0,'2026-02-14 15:36:29','2026-02-19 17:30:17'),(14,'LIQ. PEDIATRIA 6 a  12 MESES','PED1','Dieta pediátrica 6 a 12 MESES',1,'2026-02-14 15:40:40','2026-02-20 12:28:09'),(15,'SEM IRRITANTES ','S/IRRIT.','Dieta sem irritantes',0,'2026-02-14 15:43:06','2026-02-19 17:30:42'),(16,'SEM GLÚTEN ','S/GLUT.','Dieta isenta de glúten ',0,'2026-02-14 15:44:32','2026-02-19 17:30:40'),(17,'SEM LACTOSE ','S/LAC.','Dieta sem leite e seus derivados',0,'2026-02-14 15:46:17','2026-02-19 17:30:43'),(18,'POBRE EM PURINAS','-PURINAS','Dieta pobre em purinas ',0,'2026-02-14 15:57:17','2026-02-19 17:30:33'),(19,'S/ FLATULENTOS ','S/FLAT.','Dieta sem flatulentos',0,'2026-02-14 16:00:15','2026-02-19 17:30:37'),(20,'NEUTROPÊNICA','NEUTR.','Dieta neutropênica',0,'2026-02-14 16:07:42','2026-02-19 17:30:24');
/*!40000 ALTER TABLE `dietas` ENABLE KEYS */;
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
  `produto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gramatura` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Table structure for table `leitos`
--

DROP TABLE IF EXISTS `leitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leitos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `leitos` VALUES (1,'601','INTERNAÇÃO',6,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(2,'602','INTERNAÇÃO',6,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(3,'603','INTERNAÇÃO',6,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(4,'501','UTI PEDIÁTRICA',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(5,'502','UTI PEDIÁTRICA',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(6,'541','UTI ADULTO',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(7,'542','UTI ADULTO',5,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(8,'1','UDT',1,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(9,'2','UDT',1,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(10,'301','TMO',3,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(11,'302','TMO',3,1,'2026-01-28 15:04:42','2026-01-28 15:04:42'),(73,'604','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(74,'605','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(75,'606','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(76,'607','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(77,'608','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(78,'609','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-02-14 16:18:11'),(79,'610','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-02-18 22:30:17'),(80,'611','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(81,'612','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(82,'613','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(83,'614','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(84,'615','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(85,'616','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(86,'617','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(87,'618','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(88,'619','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(89,'620','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(90,'621','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(91,'622','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(92,'623','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(93,'624','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(94,'625','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(95,'626','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(96,'627','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(97,'628','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(98,'629','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(99,'630','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(100,'631','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(101,'632','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(102,'633','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(103,'634','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(104,'635','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(105,'636','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(106,'637','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(107,'638','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(108,'639','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(109,'640','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(110,'641','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-02-14 16:18:08'),(111,'642','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(112,'643','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(113,'644','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(114,'645','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(115,'646','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(116,'647','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(117,'648','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(118,'649','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(119,'650','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(120,'651','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(121,'652','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(122,'653','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(123,'654','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(124,'655','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(125,'656','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(126,'657','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(127,'658','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(128,'659','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(129,'660','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(130,'661','INTERNAÇÃO',6,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(131,'503','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(132,'504','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(133,'505','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(134,'506','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(135,'507','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(136,'508','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(137,'509','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(138,'510','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(139,'511','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(140,'512','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(141,'513','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(142,'514','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(143,'515','UTI PEDIÁTRICA',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(144,'543','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(145,'544','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(146,'545','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(147,'546','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(148,'547','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(149,'548','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(150,'549','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(151,'550','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(152,'551','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(153,'552','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(154,'553','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(155,'554','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(156,'555','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(157,'556','UTI ADULTO',5,1,'2026-01-29 18:28:23','2026-02-19 17:01:20'),(158,'3','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(159,'4','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(160,'5','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(161,'6','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(162,'7','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(163,'8','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(164,'9','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(165,'10','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(166,'11','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(167,'12','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(168,'13','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(169,'14','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(170,'15','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(171,'16','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(172,'17','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(173,'18','UDT',1,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(174,'303','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(175,'304','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(176,'305','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(177,'306','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(178,'307','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(179,'308','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(180,'309','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(181,'310','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(182,'311','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(183,'312','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(184,'313','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(185,'314','TMO',3,1,'2026-01-29 18:28:23','2026-01-29 18:28:23'),(186,'662','INTERNAÇÃO',6,0,'2026-02-20 14:48:49','2026-02-20 14:48:55'),(187,'1001','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(188,'1002','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(189,'1003','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(190,'1004','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(191,'1005','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(192,'1006','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(193,'1007','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(194,'1008','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(195,'1009','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20'),(196,'1010','TESTE ',10,1,'2026-02-20 14:49:20','2026-02-20 14:49:20');
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
  `usuario_nome` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_tentado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_evento` enum('LOGIN_SUCESSO','LOGIN_FALHA_SENHA','LOGIN_FALHA_EMAIL','LOGIN_FALHA_INATIVO','LOGIN_FALHA_RATE_LIMIT','LOGOUT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tipo_evento` (`tipo_evento`),
  KEY `idx_email_tentado` (`email_tentado`),
  KEY `idx_usuario_id` (`usuario_id`),
  KEY `idx_criado_em` (`criado_em`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_periodo_tipo` (`criado_em`,`tipo_evento`),
  CONSTRAINT `fk_logs_login_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_login`
--

LOCK TABLES `logs_login` WRITE;
/*!40000 ALTER TABLE `logs_login` DISABLE KEYS */;
INSERT INTO `logs_login` VALUES (1,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-14 23:17:53'),(2,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-14 23:19:39'),(3,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 01:28:43'),(4,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 01:28:46'),(5,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 21:59:39'),(6,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 21:59:44'),(7,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 22:11:38'),(8,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 22:11:43'),(9,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 22:12:08'),(10,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0','2026-02-15 22:53:58'),(11,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-15 23:12:31'),(12,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:21:59'),(13,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:22:09'),(14,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:30:09'),(15,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:30:28'),(16,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:32:26'),(17,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:38:02'),(18,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:39:14'),(19,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 00:47:52'),(20,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 13:54:51'),(21,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 13:55:09'),(22,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 14:14:18'),(23,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 14:14:57'),(24,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 15:31:39'),(25,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 15:31:52'),(26,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 15:56:09'),(27,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-16 16:05:21'),(28,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-16 21:19:07'),(29,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 18:12:30'),(30,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 18:24:32'),(31,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:20:22'),(32,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:20:34'),(33,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:22:34'),(34,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15','2026-02-18 22:28:20'),(35,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:28:28'),(36,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:39:37'),(37,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 22:41:50'),(38,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-18 23:10:00'),(39,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.227.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 01:27:15'),(40,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 16:57:27'),(41,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 17:31:10'),(42,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 17:32:04'),(43,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 17:32:09'),(44,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 20:34:24'),(45,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-19 20:34:28'),(46,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-19 21:14:32'),(47,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-19 21:29:45'),(48,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-19 21:29:48'),(49,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 21:34:08'),(50,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 21:51:32'),(51,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-19 21:51:36'),(52,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-20 01:30:45'),(53,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-20 01:40:12'),(54,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-20 01:49:59'),(55,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 11:06:28'),(56,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 12:09:54'),(57,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 12:23:33'),(58,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:191.58.137.190','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/145.0.7632.108 Mobile/15E148 Safari/604.1','2026-02-20 16:19:42'),(59,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:177.207.236.76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-20 17:55:51'),(60,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:187.84.190.206','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-21 02:04:29'),(61,NULL,NULL,NULL,'nutri1@hospital.com.br','LOGIN_FALHA_EMAIL','Email não encontrado no sistema.','::ffff:187.84.190.206','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-21 02:12:09'),(62,2,'Nutricionista 1','nutri1@hospital.com','nutri1@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:187.84.190.206','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-21 02:12:15'),(63,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 15:42:20'),(64,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 15:42:29'),(65,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:43:36'),(66,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:43:46'),(67,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:56:49'),(68,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 21:56:55'),(69,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15','2026-02-21 22:12:16'),(70,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-21 22:12:23'),(71,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 00:37:52'),(72,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-22 03:17:11'),(73,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:08:05'),(74,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:08:30'),(75,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:24:51'),(76,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:32:16'),(77,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:32:20'),(78,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:57:44'),(79,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:57:49'),(80,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:59:03'),(81,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 13:59:08'),(82,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGOUT',NULL,'::ffff:45.185.224.50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 14:05:35'),(83,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_FALHA_SENHA','Senha incorreta.','::ffff:201.87.253.102','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-22 16:07:16'),(84,1,'Administrador','admin@hospital.com','admin@hospital.com','LOGIN_SUCESSO',NULL,'::ffff:192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','2026-02-22 16:22:21');
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
  `nome_paciente` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_atendimento` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `convenio` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_mae` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `idade` int DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `prontuario` (`codigo_atendimento`),
  KEY `idx_prontuario` (`codigo_atendimento`),
  KEY `idx_cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'VITOR FERNANDES','1234567','07240941132','2026-02-16 15:56:44','2026-02-21 22:20:34','SUS','BEL CARVALHO','2000-06-25',25,'2026-02-16 15:56:44','2026-02-21 22:20:34'),(2,'GABRYEL','1234569','78955181191','2026-02-16 15:58:21','2026-02-16 15:58:21','SUS','TEREZA','2000-06-12',25,'2026-02-16 15:58:21','2026-02-16 15:58:21'),(3,'TEREZINHA','8983213','77988191900','2026-02-19 01:29:58','2026-02-22 13:33:28','SUS','MARIA','1965-07-25',60,'2026-02-19 01:29:58','2026-02-22 13:33:28'),(4,'Jennifer Assunção Cambronio','9999888','04410780107','2026-02-20 11:12:05','2026-02-20 11:12:05','SUS','Maria ','1994-11-11',31,'2026-02-20 11:12:05','2026-02-20 11:12:05'),(5,'TESTE TODOS DIA 22','9999999','99999999999','2026-02-21 22:16:05','2026-02-21 22:16:05','Convênio','TESTE TODOS DIA 22','1965-07-26',60,'2026-02-21 22:16:05','2026-02-21 22:16:05'),(11,'TESTE TODOS DIA 22','6666666','66666666666','2026-02-21 22:16:45','2026-02-21 22:16:45','Convênio','TESTE TODOS DIA 22','1965-07-26',60,'2026-02-21 22:16:45','2026-02-21 22:16:45'),(15,'TESTE TODOS DIA 22','1111111','22222222222','2026-02-21 22:17:32','2026-02-21 22:17:32','Convênio','TESTE TODOS DIA 22','1965-07-26',60,'2026-02-21 22:17:32','2026-02-21 22:17:32'),(21,'teste','8989898','11111111111','2026-02-22 00:41:03','2026-02-22 00:41:03','SUS','teste','1965-07-26',60,'2026-02-22 00:41:03','2026-02-22 00:41:03'),(22,'TESTE COMPLETO 123','1234777','67845631131','2026-02-22 00:49:15','2026-02-22 00:49:15','SUS','TESTE COMPLETO 123','1965-07-26',60,'2026-02-22 00:49:15','2026-02-22 00:49:15'),(23,'TESTE ABSOLUTO','3453455','12344111111','2026-02-22 13:29:37','2026-02-22 13:29:37','SUS','TESTE ABSOLUTO','1965-07-26',60,'2026-02-22 13:29:37','2026-02-22 13:29:37');
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
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_atendimento` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `convenio` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_paciente` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_mae` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_nascimento` date NOT NULL,
  `idade` int NOT NULL,
  `nucleo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leito` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_alimentacao` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dieta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `restricoes` text COLLATE utf8mb4_unicode_ci,
  `sem_principal` tinyint(1) DEFAULT '0',
  `descricao_sem_principal` text COLLATE utf8mb4_unicode_ci,
  `obs_exclusao` text COLLATE utf8mb4_unicode_ci,
  `obs_acrescimo` text COLLATE utf8mb4_unicode_ci,
  `acrescimos_ids` text COLLATE utf8mb4_unicode_ci COMMENT 'IDs dos acréscimos selecionados, separados por vírgula',
  `itens_especiais_ids` json DEFAULT NULL,
  `tem_acompanhante` tinyint(1) DEFAULT '0',
  `tipo_acompanhante` enum('adulto','crianca','idoso') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acompanhante_refeicoes` json DEFAULT NULL,
  `acompanhante_restricoes_ids` json DEFAULT NULL,
  `acompanhante_obs_livre` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Ativo',
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Armazena todas as prescrições de alimentação dos pacientes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescricoes`
--

LOCK TABLES `prescricoes` WRITE;
/*!40000 ALTER TABLE `prescricoes` DISABLE KEYS */;
INSERT INTO `prescricoes` VALUES (1,'072.409.411-32','1234567','SUS','VITOR FERNANDES','BEL CARVALHO','2000-06-26',25,'TMO','305','Desjejum','LIQ. PEDIATRIA 1  a  13 ANOS','[]',0,NULL,NULL,NULL,'[]',NULL,0,NULL,NULL,NULL,NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 19:20:34','2026-02-21 19:28:36'),(2,'072.409.411-32','1234567','SUS','VITOR FERNANDES','BEL CARVALHO','2000-06-25',25,'TMO','304','Almoço','LÍQUIDA ','[]',0,NULL,NULL,NULL,'[]','[]',0,NULL,NULL,NULL,NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 19:20:34','2026-02-21 19:20:34'),(3,'072.409.411-32','1234567','SUS','VITOR FERNANDES','BEL CARVALHO','2000-06-25',25,'TMO','304','Colação','LIQ. PEDIATRIA 6 a  12 MESES','[]',0,NULL,NULL,NULL,'[]','[]',0,NULL,NULL,NULL,NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 19:20:34','2026-02-21 19:20:34'),(4,'072.409.411-32','1234567','SUS','VITOR FERNANDES','BEL CARVALHO','2000-06-25',25,'TMO','304','Jantar','LIQ. PASTOSA ADULTO','[]',0,NULL,NULL,NULL,'[]','[]',0,NULL,NULL,NULL,NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 19:20:34','2026-02-21 19:20:34'),(5,'072.409.411-32','1234567','SUS','VITOR FERNANDES','BEL CARVALHO','2000-06-25',25,'TMO','304','Merenda','NORMAL ADULTO','[]',0,NULL,NULL,NULL,'[]','[]',0,NULL,NULL,NULL,NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 19:20:34','2026-02-21 19:20:34'),(6,'072.409.411-32','1234567','SUS','VITOR FERNANDES','BEL CARVALHO','2000-06-25',25,'TMO','304','Ceia','NORMAL ADULTO','[]',0,NULL,NULL,NULL,'[]','[]',0,NULL,NULL,NULL,NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 19:20:34','2026-02-21 19:20:34'),(7,'779.881.919-00','8983213','SUS','TEREZINHA','MARIA','1965-07-25',60,'UTI ADULTO','544','Colação','LIQ. PEDIATRIA 1  a  13 ANOS','[]',0,NULL,NULL,NULL,'[]','[]',1,'idoso','[\"Desjejum\", \"Colação\", \"Janta\", \"Ceia\", \"Merenda\", \"Almoço\"]','[]',NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 21:39:46','2026-02-21 21:39:46'),(8,'111.111.111-11','8989898','SUS','teste','teste','1965-07-26',60,'UDT','12','Desjejum','LIQ. PASTOSA ADULTO','[]',0,NULL,NULL,NULL,'[]','[]',1,'crianca','[\"Almoço\"]','[]',NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 21:41:03','2026-02-21 21:41:03'),(9,'678.456.311-31','1234777','SUS','TESTE COMPLETO 123','TESTE COMPLETO 123','1965-07-26',60,'UDT','6','Desjejum','LIQ. PASTOSA ADULTO','[\"Restrita a Vitamina K\"]',0,NULL,NULL,NULL,'[]','[]',1,'crianca','[\"Colação\"]','[1]',NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-21 21:49:15','2026-02-21 21:49:15'),(10,'779.881.919-00','8983213','SUS','TEREZINHA','MARIA','1965-07-25',60,'UDT','13','Jantar','LIQ. PEDIATRIA 1  a  13 ANOS','[\"HPS\"]',0,NULL,NULL,NULL,'[7]','[]',1,'crianca','[\"Colação\"]','[]',NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-22 10:28:46','2026-02-22 10:28:46'),(11,'123.441.111-11','3453455','SUS','TESTE ABSOLUTO','TESTE ABSOLUTO','1965-07-26',60,'TMO','308','Colação','LIQ. PEDIATRIA 1  a  13 ANOS','[\"Restrita a Vitamina K\"]',0,NULL,NULL,NULL,'[4]','[]',1,'idoso','[\"Merenda\"]','[]',NULL,'Ativo','2026-02-22 00:00:00',1,'2026-02-22 10:29:37','2026-02-22 10:29:37'),(12,'779.881.919-00','8983213','SUS','TEREZINHA','MARIA','1965-07-25',60,'UDT','12','Colação','LÍQUIDA ','[\"LAX\"]',0,NULL,NULL,NULL,'[4]','[]',0,NULL,'[]','[]',NULL,'Ativo','2026-02-23 00:00:00',1,'2026-02-22 10:32:40','2026-02-22 10:32:40'),(13,'779.881.919-00','8983213','SUS','TEREZINHA','MARIA','1965-07-25',60,'UTI ADULTO','550','Ceia','LÍQUIDA ','[\"LAX\"]',0,NULL,NULL,NULL,'[4]','[]',0,NULL,'[]','[]',NULL,'Ativo','2026-02-23 00:00:00',1,'2026-02-22 10:33:28','2026-02-22 10:33:28');
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
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_em` datetime NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `revogado` tinyint(1) DEFAULT '0',
  `revogado_em` datetime DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
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
-- Table structure for table `tipos_refeicao`
--

DROP TABLE IF EXISTS `tipos_refeicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_refeicao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ordem` int DEFAULT '999',
  `ativa` tinyint(1) DEFAULT '1',
  `tem_lista_personalizada` tinyint(1) DEFAULT '0',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `grupo_dia` enum('atual','proximo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'proximo',
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
  `nome` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','nutricionista') COLLATE utf8mb4_unicode_ci DEFAULT 'nutricionista',
  `ativo` tinyint(1) DEFAULT '1',
  `ultimo_login` timestamp NULL DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@hospital.com','$2b$10$4W2dw4x5by6c3CP2pKjVfeTt7Blk998DpQjszEpzDWeV7APAon1dm','admin',1,'2026-02-22 16:22:21','2026-01-29 18:41:10','2026-02-22 16:22:21'),(2,'Nutricionista 1','nutri1@hospital.com','$2b$10$4W2dw4x5by6c3CP2pKjVfeTt7Blk998DpQjszEpzDWeV7APAon1dm','nutricionista',1,'2026-02-21 02:12:15','2026-01-29 18:41:10','2026-02-21 02:12:15'),(3,'Nutricionista 2','nutri2@hospital.com','$2b$10$4W2dw4x5by6c3CP2pKjVfeTt7Blk998DpQjszEpzDWeV7APAon1dm','nutricionista',1,NULL,'2026-01-29 18:41:10','2026-01-29 18:58:17'),(4,'Vitor','vitor@gmail.com','$2b$10$qCn2b1SXZjc8MAwm/rIVLuwgZCOM.yFMWkQld74wBKGwBEEZr10sW','admin',1,'2026-01-30 22:20:50','2026-01-30 22:12:56','2026-01-30 22:20:50');
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
  `nome_arquivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- Dump completed on 2026-02-22 13:40:53
