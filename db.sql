DROP DATABASE IF EXISTS crudNextPoint;
DROP PROCEDURE insertUser;
DROP PROCEDURE deleteUser;
DROP PROCEDURE updateUser;

CREATE DATABASE crudNextPoint;
USE crudNextPoint;

CREATE TABLE user(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    img MEDIUMTEXT
)ENGINE=INNODB;

DELIMITER $$
    CREATE PROCEDURE insertUser(IN firstname VARCHAR(100), IN lastname VARCHAR(100), IN img MEDIUMTEXT)
        BEGIN
            INSERT INTO user VALUES(null, firstname, lastname, img);
        END$$
DELIMITER ;


DELIMITER $$
    CREATE PROCEDURE updateUser(IN _id INT(11), IN _firstname VARCHAR(100), IN _lastname VARCHAR(100), IN _img MEDIUMTEXT)
        BEGIN
            UPDATE user SET firstname=_firstname, lastname=_lastname,img=_img WHERE id=_id;
        END$$
DELIMITER ;

DELIMITER $$
    CREATE PROCEDURE deleteUser(IN _id INT(11))
        BEGIN
            DELETE FROM user WHERE id=_id;
        END$$
DELIMITER ;
