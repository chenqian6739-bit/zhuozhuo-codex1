import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default("file:./dev.db"),
  DATABASE_PROVIDER: z.enum(["postgresql", "sqlite"]).default("sqlite"),
  DEFAULT_TIMEZONE: z.string().default("Asia/Shanghai"),
  DEFAULT_CURRENCY: z.string().default("CNY"),
  SCHEDULER_CRON: z.string().default("*/30 * * * *"),
});

export const env = envSchema.parse(process.env);
