import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

/**
 * Note: Vite will only include variables that are prefixed with VITE_ in the built application.
 * Please add any updates to
 * - `.env.example`
 * - `server/entrypoint.sh`
 * - `setup-tests.ts`
 * - `src/config.ts`
 */
const mockEnv = {
  VITE_API_HOST: 'http://test-api-host.com',
};

Object.entries(mockEnv).forEach(([key, val]) => {
  vi.stubEnv(key, val);
});

const handlers = [
  http.get(`${mockEnv.VITE_API_HOST}/example`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(`Hello ${url.searchParams.get('name')}!`);
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
