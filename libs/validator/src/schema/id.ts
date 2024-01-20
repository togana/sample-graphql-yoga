import z from 'zod';

export const idSchema = z.string().or(z.null()).optional();

export type IdSchema = z.infer<typeof idSchema>;
