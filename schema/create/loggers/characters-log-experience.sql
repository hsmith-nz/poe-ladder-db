CREATE TABLE IF NOT EXISTS `poe`.`characters_experience_log`
(
    `character_id`    VARBINARY(32) NOT NULL,
    `experience_change` INT UNSIGNED NOT NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS `poe`.`log_character_experience`;

CREATE TRIGGER `poe`.`log_character_experience`
AFTER UPDATE ON `poe`.`characters`
FOR EACH ROW BEGIN
    IF ( OLD.`experience` < NEW.`experience` ) THEN
            INSERT INTO `poe`.`characters_experience_log`
            ( 
                `character_id`, 
                `experience_change` 
            )
            VALUES
            ( 
                NEW.`id`, 
                NEW.`experience` - OLD.`experience` 
            );
    END IF;
END;