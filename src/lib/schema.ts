import { z } from 'zod';

export const issueSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  severity: z.coerce.number(),
  projectId: z.number(),
  stateId: z.coerce.number(),
});

export const columnSchema = z.object({
  name: z.string().min(1).max(16),
  color: z.string(),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(16),
  shortcode: z
    .string()
    .length(3)
    .refine(value => /^[a-zA-Z]+$/.test(value), {
      message: 'Only alphabetic characters are allowed',
    }),
  description: z.string().min(1).max(255).nullable(),
});

export const noteSchema = z.object({ name: z.string().min(1).max(64) });
