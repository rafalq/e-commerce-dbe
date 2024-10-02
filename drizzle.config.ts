import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

export default defineConfig({
  schema: './server/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DB_URL!,
  },
});
