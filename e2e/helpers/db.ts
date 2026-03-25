import pg from 'pg';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://stockviz:stockviz@localhost:5432/stockviz';

async function query(sql: string, params: unknown[] = []): Promise<void> {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query(sql, params);
  } finally {
    await client.end();
  }
}

export async function insertCurrency(code: string, name: string): Promise<void> {
  await query('INSERT INTO currencies (code, name) VALUES ($1, $2)', [code, name]);
}

export async function deleteCurrency(code: string): Promise<void> {
  await query('DELETE FROM currencies WHERE code = $1', [code]);
}

export async function insertExchange(
  code: string,
  name: string,
  countryCode: string,
): Promise<void> {
  await query('INSERT INTO exchanges (code, name, country_code) VALUES ($1, $2, $3)', [
    code,
    name,
    countryCode,
  ]);
}

export async function deleteExchange(code: string): Promise<void> {
  await query('DELETE FROM exchanges WHERE code = $1', [code]);
}
