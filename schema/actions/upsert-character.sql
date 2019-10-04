INSERT INTO `poe`.`characters`
( `id`, `name`, `class`, `experience`, `level`, `dead`, `rank`, `account_id`, `event_id` )
VALUES
( UNHEX( ? ), ?, ?, ?, ?, ?, ?, ?, ? )
ON DUPLICATE KEY UPDATE
`id` = VALUES( `id` ),
`name` = VALUES( `name`),
`class` = VALUES( `class` ),
`level` = VALUES( `level` ),
`dead` = VALUES( `dead` ),
`rank` = VALUES( `rank` ),
`experience` = VALUES( `experience` ),
`account_id` = VALUES( `account_id` ),
`event_id` = VALUES( `event_id` ); 

    