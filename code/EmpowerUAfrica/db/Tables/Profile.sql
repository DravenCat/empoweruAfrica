CREATE TABLE IF NOT EXISTS `Profile` (
    `username` VARCHAR(31) NOT NuLL UNIQUE,
    `name` VARCHAR(255),
    `gender` INT,
    `birthdate` DATE,
    `phone_number` VARCHAR(31),
    `industry` VARCHAR(255),
    `pfp_type` INT,
    `description` TEXT,
    `website` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;