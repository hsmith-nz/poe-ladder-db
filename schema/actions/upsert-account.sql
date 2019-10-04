INSERT INTO `poe`.`accounts`
( `id` )
VALUES
( ? )
ON DUPLICATE KEY UPDATE
`id` = VALUES( `id` );