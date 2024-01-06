import { decodeGlobalID } from '@pothos/plugin-relay';
import z from 'zod';

export const createPostSchema = z.object({
  input: z.object({
    title: z.string(),
    authorId: z.string().or(z.number()).superRefine((value, ctx) => {
      const { typename } = decodeGlobalID(value.toString());
      if (typename !== 'User') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid authorId typename ${typename}`,
        });
      }
    }),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
