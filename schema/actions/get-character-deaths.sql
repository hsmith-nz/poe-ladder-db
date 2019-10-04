SELECT * FROM
`poe`.`characters`,
( SELECT `character_id`, SUM (`dead_change` )  AS `dead_change_total`
FROM `poe`.`characters_dead_log`
WHERE `logged_at` >= FROM_UNIXTIME( ? * 0.001 )
AND `logged_at` < FROM_UNIXTIME( ? * 0.001 )
GROUP BY `character_id` ) AS `changes`
WHERE `poe`.`characters`.`id` = `changes`.`character_id`;