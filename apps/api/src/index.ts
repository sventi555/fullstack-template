import 'dotenv/config';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import greetings from './routes/greetings';

const app = new Hono();

app.use('/api/*', cors());

app.route('/api/greetings', greetings);

const port = process.env.PORT;
console.log(`Server is running on http://localhost:${port}`);

export default {
  fetch: app.fetch,
  port,
};
