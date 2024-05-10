import { GetExampleQuery, GetExampleReturn } from 'lib';

export const getExample = (
  query: GetExampleQuery,
): Promise<GetExampleReturn> => {
  return fetch(
    `${import.meta.env['VITE_API_HOST']}/example?${new URLSearchParams(query)}`,
  ).then<GetExampleReturn>((res) => res.json());
};
