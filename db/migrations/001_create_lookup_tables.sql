-- migrate:up
CREATE TABLE exchanges (
  id   SERIAL      PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,  -- e.g. NASDAQ, NYSE, LSE
  name VARCHAR(100) NOT NULL,
  country_code CHAR(2)               -- ISO 3166-1 alpha-2, e.g. US, GB
);

CREATE TABLE currencies (
  id   SERIAL   PRIMARY KEY,
  code CHAR(3)  NOT NULL UNIQUE,  -- ISO 4217, e.g. USD, EUR, GBP
  name VARCHAR(50) NOT NULL
);

CREATE TABLE sectors (
  id   SERIAL       PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE  -- e.g. Technology, Healthcare
);

-- migrate:down
DROP TABLE sectors;
DROP TABLE currencies;
DROP TABLE exchanges;
