INSERT INTO `poe`.`challenges`
( `account_id`, `league_id`, `total` )
VALUES
( ?, ?, ? )
ON DUPLICATE KEY UPDATE
`account_id` = VALUES( `account_id` ),
`league_id` = VALUES( `league_id`),
`total` = VALUES( `total` );