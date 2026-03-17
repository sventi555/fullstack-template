import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { type GetGreetingsReturn, getGreetingsQuery } from 'lib';

const app = new Hono();

app.get('/', zValidator('query', getGreetingsQuery), (c) => {
  const { name } = c.req.valid('query');

  return c.json<GetGreetingsReturn>(`Hello ${name}!`);
});

export default app;
