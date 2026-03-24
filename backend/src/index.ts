import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { assetRoutes } from './routes/assets.js';
import { exchangeRoutes } from './routes/exchanges.js';
import { currencyRoutes } from './routes/currencies.js';
import { FakeAssetRepository } from './repositories/assetRepository.fake.js';
import { DrizzleExchangeRepository } from './repositories/exchangeRepository.drizzle.js';
import { DrizzleCurrencyRepository } from './repositories/currencyRepository.drizzle.js';
import { CachedExchangeRepository } from './repositories/exchangeRepository.cached.js';
import { CachedCurrencyRepository } from './repositories/currencyRepository.cached.js';

const assetRepo = new FakeAssetRepository();
const exchangeRepo = new CachedExchangeRepository(new DrizzleExchangeRepository());
const currencyRepo = new CachedCurrencyRepository(new DrizzleCurrencyRepository());

const app = new Hono();
app.route('/assets', assetRoutes(assetRepo));
app.route('/exchanges', exchangeRoutes(exchangeRepo));
app.route('/currencies', currencyRoutes(currencyRepo));

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});
