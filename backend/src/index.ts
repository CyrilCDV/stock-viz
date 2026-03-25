import { serve } from '@hono/node-server';
import { createApp } from './server.js';

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: createApp().fetch, port, hostname: '0.0.0.0' }, () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});
