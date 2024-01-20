import z from 'zod';
import { idSchema } from './id';

export const connectionSchema = z.object({
  before: idSchema,
  after: idSchema,
  first: z.number().optional(),
  last: z.number().optional(),
});

export type ConnectionSchema = z.infer<typeof connectionSchema>;
