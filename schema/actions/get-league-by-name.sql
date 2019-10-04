SELECT * 
FROM `poe`.`leagues`
WHERE UPPER( `name` ) = UPPER( ? );