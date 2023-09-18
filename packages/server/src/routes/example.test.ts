import { Hono } from 'hono';
import { exampleRoutes } from './example';

describe('example routes', () => {
  const app = new Hono();
  exampleRoutes(app);
  const route = '/example';

  describe('GET /example', () => {
    it('should return a validation error if name is missing', async () => {
      const res = await app.request(route);
      expect(res.status).toBe(400);
    });

    it('should respond with "Hello <name>"', async () => {
      const res = await app.request(`${route}?name=sventi`);
      expect(res.status).toEqual(200);
      expect(await res.text()).toBe('Hello sventi!');
    });
  });
});
