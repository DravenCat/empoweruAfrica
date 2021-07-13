CREATE TABLE IF NOT EXISTS `Video` (
    `id` INT NOT NULL UNIQUE,
    `name` TEXT NOT NULL,
    `description` TEXT,
    `url` TEXT NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;