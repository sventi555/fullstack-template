import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { toInt } from 'lib';
import { exampleRoutes } from './routes/example';

const app = new Hono();

app.use('*', cors());

exampleRoutes(app);

serve({ fetch: app.fetch, port: toInt(process.env.PORT) });
