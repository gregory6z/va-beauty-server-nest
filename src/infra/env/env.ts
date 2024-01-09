import { z } from "zod"

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
