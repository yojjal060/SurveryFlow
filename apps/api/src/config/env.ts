import { z } from "zod";
import fs from "node:fs";
import path from "node:path";

const loadEnvFile = (process as NodeJS.Process & {
  loadEnvFile?: (path?: string) => void;
}).loadEnvFile;

if (loadEnvFile) {
  let directory = process.cwd();
  for (;;) {
    for (const filename of [".env.local", ".env"]) {
      const envPath = path.join(directory, filename);
      if (fs.existsSync(envPath)) {
        try {
          loadEnvFile(envPath);
        } catch {
          // Continue to platform environment variables.
        }
      }
    }
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(32).optional(),
  DATABASE_URL: z.string().optional(),
  NEON_BRANCH: z.string().optional(),
  NEON_BRANCH_ID: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_ENDPOINT_URL_S3: z.string().optional(),
  AWS_REGION: z.string().optional()
});

export const env = envSchema.parse(process.env);