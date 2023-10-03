import { z } from 'zod';

export const getExampleQuerySchema = z.object({ name: z.string() });
export type GetExampleQuery = z.infer<typeof getExampleQuerySchema>;
export type GetExampleReturn = string;
