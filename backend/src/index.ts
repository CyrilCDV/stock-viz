import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { assetRoutes } from './routes/assets.js';
import { FakeAssetRepository } from './repositories/assetRepository.fake.js';

const repo = new FakeAssetRepository();

const app = new Hono();
app.route('/assets', assetRoutes(repo));

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});
