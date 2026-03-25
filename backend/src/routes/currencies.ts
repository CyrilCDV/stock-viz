import { Hono } from 'hono';
import { CurrencyRepository } from '../repositories/currencyRepository.js';

export function currencyRoutes(repo: CurrencyRepository) {
  const app = new Hono();

  app.get('/', async (c) => {
    return c.json(await repo.findAll());
  });

  app.get('/:code', async (c) => {
    const currency = await repo.findByCode(c.req.param('code').toUpperCase());
    if (!currency) return c.json({ error: 'Currency not found' }, 404);
    return c.json(currency);
  });

  return app;
}
