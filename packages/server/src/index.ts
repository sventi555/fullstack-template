import Fastify from 'fastify';
import { exampleRoutes } from './routes';
import { toInt } from './utils/parse';

const fastify = Fastify({ logger: true });

fastify.register(exampleRoutes);

(async () => {
  try {
    await fastify.listen({
      host: '0.0.0.0',
      port: toInt(process.env.PORT) || 3000,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
