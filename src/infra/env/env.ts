import { z } from "zod"

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RESEND_KEY: z.string(),
  URL_FRONTEND: z.string().url(),
  NODE_ENV: z.string().optional().default("development"),
})

export type Env = z.infer<typeof envSchema>
