import { Hono } from 'hono';
import { AssetRepository } from '../repositories/assetRepository.js';
import { CreateAssetPayload } from '../models/asset.js';

export function assetRoutes(repo: AssetRepository) {
  const app = new Hono();

  app.get('/', async (c) => {
    const assets = await repo.findAll();
    return c.json(assets);
  });

  app.get('/:id', async (c) => {
    const asset = await repo.findById(c.req.param('id'));
    if (!asset) return c.json({ error: 'Asset not found' }, 404);
    return c.json(asset);
  });

  app.post('/', async (c) => {
    const body = await c.req.json<CreateAssetPayload>();
    const asset = await repo.create(body);
    return c.json(asset, 201);
  });

  app.delete('/:id', async (c) => {
    const deleted = await repo.deleteById(c.req.param('id'));
    if (!deleted) return c.json({ error: 'Asset not found' }, 404);
    return c.body(null, 204);
  });

  return app;
}
