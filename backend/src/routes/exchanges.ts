import { Hono } from 'hono';
import { ExchangeRepository } from '../repositories/exchangeRepository.js';

export function exchangeRoutes(repo: ExchangeRepository) {
  const app = new Hono();

  app.get('/', async (c) => {
    return c.json(await repo.findAll());
  });

  app.get('/:code', async (c) => {
    const exchange = await repo.findByCode(c.req.param('code').toUpperCase());
    if (!exchange) return c.json({ error: 'Exchange not found' }, 404);
    return c.json(exchange);
  });

  return app;
}
