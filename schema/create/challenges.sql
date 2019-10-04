CREATE TABLE IF NOT EXISTS `poe`.`challenges`
(
    `account_id`    VARCHAR(32) NOT NULL,
    `league_id`     INT UNSIGNED NOT NULL,
    `total`         TINYINT NOT NULL,
    PRIMARY KEY( `account_id`, `league_id` )
);