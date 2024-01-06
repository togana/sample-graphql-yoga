import z from 'zod';

export const searchPostSchema = z.object({
  title: z.string().optional(),
});

export type SearchPostSchema = z.infer<typeof searchPostSchema>;
