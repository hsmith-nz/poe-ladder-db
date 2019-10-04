SELECT * FROM
`poe`.`events`,
( SELECT `event_id`, SUM ( `active_change` )  AS `active_change_total`
FROM `poe`.`events_active_log`
WHERE `logged_at` >= FROM_UNIXTIME( ? * 0.001 )
AND `logged_at` < FROM_UNIXTIME( ? * 0.001 )
GROUP BY `event_id` ) AS `changes`
WHERE `poe`.`events`.`id` = `changes`.`event_id`;