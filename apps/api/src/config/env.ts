import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform((val) => parseInt(val, 10)),
  COMMIT_SHA: z.string().default('unknown'), // Default to unknown if not provided (e.g. dev)
  BUILD_ID: z.string().default('local'),
  REGION: z.string().optional(),
  API_VERSION: z.string().default('1.0.0'),
});

// Validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
