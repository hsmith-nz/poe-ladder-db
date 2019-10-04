CREATE TABLE IF NOT EXISTS `poe`.`characters_level_log`
(
    `character_id` VARBINARY(32) NOT NULL,
    `level_change` TINYINT NOT NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS `poe`.`log_character_level`;

CREATE TRIGGER `poe`.`log_character_level`
AFTER UPDATE ON `poe`.`characters`
FOR EACH ROW BEGIN
    IF ( OLD.`level` < NEW.`level` ) THEN
            INSERT INTO `poe`.`characters_level_log`
            ( 
                `character_id`, 
                `level_change` 
            )
            VALUES
            ( 
                NEW.`id`, 
                NEW.`level` - OLD.`level` 
            );
    END IF;
END;