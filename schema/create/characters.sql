CREATE TABLE IF NOT EXISTS `poe`.`characters`
(
    `id`    VARBINARY(32) NOT NULL PRIMARY KEY,
    `name`  VARCHAR(32) NOT NULL,
    `class` ENUM( 
        'marauder',
        'duelist',
        'ranger',
        'shadow',
        'witch',
        'templar',
        'scion',
        'juggernaut', 'berserker', 'chieftain',
        'slayer', 'gladiator', 'champion',
        'deadeye', 'raider', 'pathfinder',
        'assassin', 'saboteur', 'trickster',
        'necromancer', 'occultist', 'elementalist',
        'inquisitor', 'hierophant', 'guardian',
        'ascendant'
    ) NOT NULL,
    `experience` INT UNSIGNED NOT NULL,
    `level` TINYINT NOT NULL,
    `dead` BOOLEAN NOT NULL,
    `rank` INT UNSIGNED NOT NULL,
    `event_id` INT UNSIGNED NOT NULL,
    `account_id` VARCHAR(32) NOT NULL
); 