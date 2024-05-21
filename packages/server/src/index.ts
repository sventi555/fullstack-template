import 'dotenv/config';

import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { toInt } from 'lib';
import { exampleRoutes } from './routes/example';

const app = new OpenAPIHono();

app.use('*', cors());

exampleRoutes(app);

serve({ fetch: app.fetch, port: toInt(process.env.PORT) });

app.get(
  'docs',
  swaggerUI({
    url: '/schema',
  }),
);

app.doc('/schema', {
  openapi: '3.1.0',
  info: { version: '1.0.0', title: 'Fullstack API' },
});
