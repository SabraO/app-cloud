USE healthcheckdb ;

CREATE TABLE IF NOT EXISTS APP_CLOUD_LAUNCH_URLS (
  ID INT NOT NULL AUTO_INCREMENT,
  LAUNCH_URL VARCHAR(500) NOT NULL,
  DESCRIPTION VARCHAR(1000) NULL,
  PRIMARY KEY (ID))
ENGINE = InnoDB;
