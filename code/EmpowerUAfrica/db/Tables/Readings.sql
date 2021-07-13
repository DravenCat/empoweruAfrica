CREATE TABLE IF NOT EXISTS `Readings` (
    `id` INT NOT NULL UNIQUE,
    `name` TEXT NOT NULL,
    `description` TEXT,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;