import { FastifyInstance } from 'fastify';

export const exampleRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    return { hello: 'world' };
  });
};
