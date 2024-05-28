import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const getAPIClient = () =>
  createClient<paths>({
    baseUrl: import.meta.env['VITE_API_HOST'],
  });
