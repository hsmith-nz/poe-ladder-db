CREATE TABLE IF NOT EXISTS `poe`.`challenges_total_log`
(
    `account_id` VARCHAR(32) NOT NULL,
    `league_id` INT UNSIGNED NOT NULL,
    `total_change` TINYINT NOT NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS `poe`.`log_challenges_total`;

CREATE TRIGGER `poe`.`log_challenges_total`
AFTER UPDATE ON `poe`.`challenges`
FOR EACH ROW BEGIN
    IF ( OLD.`total` < NEW.`total` ) THEN
        INSERT INTO `poe`.`challenges_total_log`
        (                     
            `account_id`,
            `league_id`,
            `total_change`     
        )
        VALUES
        ( 
            NEW.`account_id`,
            NEW.`league_id`, 
            NEW.`total` - OLD.`total` 
        );
    END IF;
END;