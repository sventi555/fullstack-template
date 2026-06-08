import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

const app = new OpenAPIHono();

const getGreetingsRoute = createRoute({
  operationId: 'getGreetings',
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      name: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully retrieved greetings',
      content: { 'application/json': { schema: z.string() } },
    },
  },
});

app.openapi(getGreetingsRoute, async (c) => {
  const { name } = c.req.valid('query');

  return c.json(`Hello ${name}!`, 200);
});

export default app;
