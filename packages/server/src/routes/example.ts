import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { GetExampleReturn, getExampleQuerySchema } from 'lib';

export const exampleRoutes = (app: Hono) => {
  app.get('/example', zValidator('query', getExampleQuerySchema), (c) => {
    const { name } = c.req.valid('query');

    return c.json<GetExampleReturn>(`Hello ${name}!`);
  });
};
