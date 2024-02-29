CREATE TABLE `final_status`(
    `id_final_status` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_status` INT UNSIGNED NOT NULL,
    `id_machine` VARCHAR(255) NOT NULL,
    `id_problem` INT UNSIGNED NOT NULL,
    `start` DATETIME NOT NULL,
    `end` DATETIME NOT NULL
);
CREATE TABLE `production`(
    `id_production` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date` DATETIME NOT NULL,
    `shift` INT NOT NULL,
    `id_pca` INT UNSIGNED NOT NULL,
    `ok` BIGINT NOT NULL,
    `ng` BIGINT NOT NULL,
    `reject_setting` BIGINT NOT NULL,
    `production_time` BIGINT NOT NULL,
    `stop_time` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
CREATE TABLE `kanagata`(
    `id_kanagata` VARCHAR(255) NOT NULL,
    `actual_shot` BIGINT DEFAULT 0 NOT NULL,
    `limit_shot` BIGINT DEFAULT 0 NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
ALTER TABLE
    `kanagata` ADD PRIMARY KEY(`id_kanagata`);
CREATE TABLE `users`(
    `id_user` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `roles` VARCHAR(255) NOT NULL DEFAULT 'viewer',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
CREATE TABLE `pca`(
    `id_pca` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_machine` VARCHAR(255) NOT NULL,
    `id_product` VARCHAR(255) NOT NULL,
    `id_kanagata` VARCHAR(255) NOT NULL,
    `speed` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
CREATE TABLE `product`(
    `id_product` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
ALTER TABLE
    `product` ADD PRIMARY KEY(`id_product`);
CREATE TABLE `machine`(
    `id_machine` VARCHAR(255) NOT NULL,
    `actual_shot` BIGINT NOT NULL,
    `limit_shot` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `address` VARCHAR(255) NOT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
ALTER TABLE
    `machine` ADD PRIMARY KEY(`id_machine`);
CREATE TABLE `status`(
    `id_status` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);
CREATE TABLE `log_status`(
    `id_log_status` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_problem` INT UNSIGNED NOT NULL,
    `id_status` INT UNSIGNED NOT NULL,
    `id_machine` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `problem`(
    `id_problem` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL
);
ALTER TABLE
    `final_status` ADD CONSTRAINT `final_status_id_status_foreign` FOREIGN KEY(`id_status`) REFERENCES `status`(`id_status`);
ALTER TABLE
    `pca` ADD CONSTRAINT `pca_id_product_foreign` FOREIGN KEY(`id_product`) REFERENCES `product`(`id_product`);
ALTER TABLE
    `production` ADD CONSTRAINT `production_id_pca_foreign` FOREIGN KEY(`id_pca`) REFERENCES `pca`(`id_pca`);
ALTER TABLE
    `final_status` ADD CONSTRAINT `final_status_id_machine_foreign` FOREIGN KEY(`id_machine`) REFERENCES `machine`(`id_machine`);
ALTER TABLE
    `pca` ADD CONSTRAINT `pca_id_kanagata_foreign` FOREIGN KEY(`id_kanagata`) REFERENCES `kanagata`(`id_kanagata`);
ALTER TABLE
    `log_status` ADD CONSTRAINT `log_status_id_problem_foreign` FOREIGN KEY(`id_problem`) REFERENCES `problem`(`id_problem`);
ALTER TABLE
    `final_status` ADD CONSTRAINT `final_status_id_problem_foreign` FOREIGN KEY(`id_problem`) REFERENCES `problem`(`id_problem`);
ALTER TABLE
    `pca` ADD CONSTRAINT `pca_id_machine_foreign` FOREIGN KEY(`id_machine`) REFERENCES `machine`(`id_machine`);
ALTER TABLE
    `log_status` ADD CONSTRAINT `log_status_id_machine_foreign` FOREIGN KEY(`id_machine`) REFERENCES `machine`(`id_machine`);
ALTER TABLE
    `log_status` ADD CONSTRAINT `log_status_id_status_foreign` FOREIGN KEY(`id_status`) REFERENCES `status`(`id_status`);