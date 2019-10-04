CREATE TABLE IF NOT EXISTS `poe`.`characters_dead_log`
(
    `character_id` VARBINARY(32) NOT NULL,
    `dead_change` BOOLEAN NOT NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS `poe`.`log_character_dead`;

CREATE TRIGGER `poe`.`log_character_dead`
AFTER UPDATE ON `poe`.`characters`
FOR EACH ROW BEGIN
    IF ( OLD.`dead` != NEW.`dead` ) THEN
        INSERT INTO `poe`.`characters_dead_log`
        ( 
            `character_id`, 
            `dead_change`
        )
        VALUES
        ( 
            NEW.`id`, 
            NEW.`dead` - OLD.`dead` 
        );
    END IF;
END;