import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { name } from 'lib';

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
  const query = c.req.valid('query');

  const greeting =
    query.name === name
      ? `I've been expecting you.`
      : 'What a pleasant surprise.';

  return c.json(`Hello ${query.name}! ${greeting}`, 200);
});

export default app;
