import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string(),
  NEON_BRANCH: z.string(),
  NEON_BRANCH_ID: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ENDPOINT_URL_S3: z.string(),
  AWS_REGION: z.string()
});

export const env = envSchema.parse(process.env);