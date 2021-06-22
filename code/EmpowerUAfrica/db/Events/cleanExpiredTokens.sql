CREATE EVENT `cleanExpiredTokens`
    ON SCHEDULE
    EVERY 1 HOUR
    COMMENT 'Delete expired token entry'
    DO
    BEGIN

        DELETE FROM `Token` WHERE `expiration_time` < NOW(); 
    
    END;