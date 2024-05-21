import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  method: 'get',
  path: '/example',
  request: {
    query: z.object({ name: z.string() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.string(),
        },
      },
      description: 'Retrieve a greeting',
    },
  },
});

export const exampleRoutes = (app: OpenAPIHono) => {
  app.openapi(route, (c) => {
    const { name } = c.req.valid('query');

    return c.json(`Hello ${name}!`);
  });
};
