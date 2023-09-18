import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { toInt } from 'lib';
import { exampleRoutes } from './routes/example';

const app = new Hono();

exampleRoutes(app);

serve({ fetch: app.fetch, port: toInt(process.env.PORT) });
