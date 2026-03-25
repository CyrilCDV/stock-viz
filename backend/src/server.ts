import { Hono } from 'hono';
import { assetRoutes } from './routes/assets.js';
import { exchangeRoutes } from './routes/exchanges.js';
import { currencyRoutes } from './routes/currencies.js';
import { FakeAssetRepository } from './repositories/assetRepository.fake.js';
import { DrizzleExchangeRepository } from './repositories/exchangeRepository.drizzle.js';
import { DrizzleCurrencyRepository } from './repositories/currencyRepository.drizzle.js';
import { CachedExchangeRepository } from './repositories/exchangeRepository.cached.js';
import { CachedCurrencyRepository } from './repositories/currencyRepository.cached.js';

export function createApp() {
  const assetRepo = new FakeAssetRepository();
  const exchangeRepo = new CachedExchangeRepository(new DrizzleExchangeRepository());
  const currencyRepo = new CachedCurrencyRepository(new DrizzleCurrencyRepository());

  const app = new Hono();
  app.route('/assets', assetRoutes(assetRepo));
  app.route('/exchanges', exchangeRoutes(exchangeRepo));
  app.route('/currencies', currencyRoutes(currencyRepo));
  return app;
}
