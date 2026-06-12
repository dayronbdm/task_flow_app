-- MySQL dump
-- Database: sase_final_2026
-- App: TaskFlow — Task Tracker
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
DROP TABLE IF EXISTS `task`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id`       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(80)   NOT NULL,
  `email`         VARCHAR(255)  NOT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` DATETIME      DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table: task  (FK → user)
-- ----------------------------
CREATE TABLE `task` (
  `task_id`     INT UNSIGNED                          NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED                          NOT NULL,
  `title`       VARCHAR(255)                          NOT NULL,
  `description` TEXT                                  DEFAULT NULL,
  `status`      ENUM('todo','in_progress','done')     NOT NULL DEFAULT 'todo',
  `priority`    ENUM('low','medium','high')           NOT NULL DEFAULT 'medium',
  `due_date`    DATE                                  DEFAULT NULL,
  `created_at`  DATETIME                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME                              DEFAULT NULL,
  `deleted_at`  DATETIME                              DEFAULT NULL,
  PRIMARY KEY (`task_id`),
  KEY `fk_task_user_idx` (`user_id`),
  CONSTRAINT `fk_task_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Sample data
-- ----------------------------
INSERT INTO `user` (`username`, `email`, `password_hash`, `created_at`) VALUES
  ('admin',    'admin@example.com', '$2a$12$placeholder_hash_admin000000000000000000000000000000', NOW()),
  ('testuser', 'test@example.com',  '$2a$12$placeholder_hash_test0000000000000000000000000000000', NOW());

INSERT INTO `task` (`user_id`, `title`, `description`, `status`, `priority`, `due_date`, `created_at`) VALUES
  (1, 'Set up project structure',  'Initialize Nuxt app with TypeORM and JWT auth',      'done',        'high',   '2026-06-01', NOW()),
  (1, 'Implement authentication',  'JWT login and register with bcrypt password hashing', 'done',        'high',   '2026-06-05', NOW()),
  (1, 'Build task CRUD API',       'GET, POST, PUT, DELETE endpoints for tasks',          'in_progress', 'high',   '2026-06-12', NOW()),
  (1, 'Design frontend UI',        'Bootstrap 5 dark theme with filter tabs',             'in_progress', 'medium', '2026-06-14', NOW()),
  (1, 'Write database dump',       'Export schema and sample data to dump.sql',           'todo',        'low',    '2026-06-15', NOW()),
  (2, 'Review course material',    NULL,                                                  'todo',        'medium', NULL,         NOW()),
  (2, 'Prepare for presentation',  'Practice the app demo and explain the architecture',  'todo',        'high',   '2026-06-20', NOW());

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

-- Dump completed on 2026-06-12
