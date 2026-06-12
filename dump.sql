-- MySQL dump
-- Database: sase_final_2026
-- Generated: 2026-06-12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE IF NOT EXISTS `sase_final_2026`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `sase_final_2026`;

-- ----------------------------
-- Table: user
-- ----------------------------
DROP TABLE IF EXISTS `note`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id`       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(80)     NOT NULL,
  `email`         VARCHAR(255)    NOT NULL,
  `password_hash` VARCHAR(255)    NOT NULL,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` DATETIME        DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table: note  (FK → user)
-- ----------------------------
CREATE TABLE `note` (
  `note_id`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `title`      VARCHAR(255) NOT NULL,
  `content`    TEXT         NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     DEFAULT NULL,
  `deleted_at` DATETIME     DEFAULT NULL,
  PRIMARY KEY (`note_id`),
  KEY `fk_note_user_idx` (`user_id`),
  CONSTRAINT `fk_note_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Sample data
-- ----------------------------
INSERT INTO `user` (`username`, `email`, `password_hash`, `created_at`) VALUES
  ('admin', 'admin@example.com', '$2a$12$PlaceholderHashForDemoOnly00000000000000000000000000000', NOW()),
  ('testuser', 'test@example.com', '$2a$12$PlaceholderHashForDemoOnly00000000000000000000000000001', NOW());

INSERT INTO `note` (`user_id`, `title`, `content`, `created_at`) VALUES
  (1, 'Welcome Note', 'Welcome to iNotes! This is your first note.', NOW()),
  (1, 'JWT Auth', 'This app uses HS256 JWT tokens for authentication, with bcrypt password hashing.', NOW()),
  (2, 'My First Note', 'Hello from testuser!', NOW());

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

-- Dump completed on 2026-06-12
