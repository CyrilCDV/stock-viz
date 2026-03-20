-- migrate:up
CREATE TYPE asset_type AS ENUM ('stock', 'etf', 'crypto', 'bond', 'index', 'commodity');

CREATE TABLE assets (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol      VARCHAR(20) NOT NULL UNIQUE,
  name        VARCHAR(200) NOT NULL,
  type        asset_type  NOT NULL,
  isin        CHAR(12),
  exchange_id INTEGER     REFERENCES exchanges(id),
  currency_id INTEGER     NOT NULL REFERENCES currencies(id),
  sector_id   INTEGER     REFERENCES sectors(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:down
DROP TABLE assets;
DROP TYPE asset_type;
