import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

export default {
  fetch: app.fetch,
  port,
};
