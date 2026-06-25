import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:3001/schema',
    output: {
      headers: true,
      target: './src/api.gen.ts',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './orval.mutator.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
