SELECT * FROM
`poe`.`challenges`,
( SELECT `account_id`, SUM ( `total_change` )  AS `total_change_total`
FROM `poe`.`challenges_total_log`
WHERE `logged_at` >= FROM_UNIXTIME( ? * 0.001 )
AND `logged_at` < FROM_UNIXTIME( ? * 0.001 )
GROUP BY `account_id`, `league_id` ) AS `changes`
WHERE `poe`.`challenges`.`account_id` = `changes`.`account_id`;