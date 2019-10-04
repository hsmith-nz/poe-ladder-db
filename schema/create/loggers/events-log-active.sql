CREATE TABLE IF NOT EXISTS `poe`.`events_active_log`
(
    `event_id` INT UNSIGNED NOT NULL,
    `active_change` BOOLEAN NOT NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS `poe`.`log_events_active`;

CREATE TRIGGER `poe`.`log_events_active`
AFTER UPDATE ON `poe`.`events`
FOR EACH ROW BEGIN
    IF ( OLD.`active` != NEW.`active` ) THEN
        INSERT INTO `poe`.`events_active_log`
        (                     
            `event_id`,
            `active_change`     
        )
        VALUES
        ( 
            NEW.`id`, 
            NEW.`active` - OLD.`active` 
        );
    END IF;
END;