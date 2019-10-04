DROP TRIGGER IF EXISTS character_validate_event;

CREATE TRIGGER character_validate_event
BEFORE UPDATE ON characters
FOR EACH ROW
BEGIN
	IF (OLD.`event_id` < NEW.`event_id`) THEN   -- going from parent to child
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'ENTRY_IGNORED';
    END IF;
END;
