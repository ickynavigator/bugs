import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import { vercel } from '@t3-oss/env-nextjs/presets';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_VERCEL_URL: z.string().min(1).default('localhost:3000'),
  },
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        str => !str.includes('YOUR_MYSQL_URL_HERE'),
        'You forgot to change the default URL',
      ),
    DATABASE_TOKEN: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  },
  extends: [vercel],
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
