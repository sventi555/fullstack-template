import 'dotenv/config';

import { cors } from 'hono/cors';
import greetings from './routes/greetings';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono();

app.use('/api/*', cors());

app.route('/api/greetings', greetings);

app.doc('/schema', {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Fullstack API' },
});

app.get(
  '/docs',
  swaggerUI({
    url: '/schema',
  }),
);

const port = process.env.PORT;

export default {
  fetch: app.fetch,
  port,
};
