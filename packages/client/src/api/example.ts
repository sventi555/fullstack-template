import { GetExampleQuery, GetExampleReturn } from 'lib';
import config from '../config';

export const getExample = (
  query: GetExampleQuery,
): Promise<GetExampleReturn> => {
  return fetch(
    `${config.apiHost}/example?${new URLSearchParams(query)}`,
  ).then<GetExampleReturn>((res) => res.json());
};
