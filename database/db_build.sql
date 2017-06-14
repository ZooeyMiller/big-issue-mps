BEGIN;

DROP TABLE IF EXISTS emails CASCADE;

CREATE TABLE emails (
  id            SERIAL        PRIMARY KEY,
  uuid          VARCHAR(64)   UNIQUE,
  name          VARCHAR(64)   NOT NULL,
  email         VARCHAR(64)   NOT NULL,
  mp_name       VARCHAR(64)   NOT NULL,
  mp_email      VARCHAR(64)   NOT NULL,
  sent          BOOLEAN       NOT NULL,
  user_input    VARCHAR(500)
);

COMMIT;
