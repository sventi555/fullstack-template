import Fastify from 'fastify';
import { exampleRoutes } from './routes';

const fastify = Fastify({ logger: true });

fastify.register(exampleRoutes);

(async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
