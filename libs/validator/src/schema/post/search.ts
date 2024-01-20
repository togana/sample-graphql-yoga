import z from 'zod';
import { connectionSchema } from '../connection';

export const searchPostSchema = z.object({
  input: z.object({
    title: z.string().optional(),
  }).optional(),
}).merge(connectionSchema);

export type SearchPostSchema = z.infer<typeof searchPostSchema>;
