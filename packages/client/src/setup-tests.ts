import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const handlers = [
  http.get(`${import.meta.env['VITE_API_HOST']}/example`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(`Hello ${url.searchParams.get('name')}!`);
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
