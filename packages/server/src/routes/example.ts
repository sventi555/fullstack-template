import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const exampleRoutes = (app: Hono) => {
  const schema = z.object({ name: z.string() });
  app.get('/example', zValidator('query', schema), (c) => {
    const { name } = c.req.valid('query');

    return c.text(`Hello ${name}!`);
  });
};
