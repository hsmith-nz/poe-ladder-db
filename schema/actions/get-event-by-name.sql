SELECT * 
FROM `poe`.`events`
WHERE UPPER( `name` ) = UPPER( ? );