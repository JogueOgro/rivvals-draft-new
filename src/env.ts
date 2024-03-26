import { createEnv } from '@t3-oss/env-nextjs'

import { z } from 'zod'

const nodeEnv = z.enum(['development', 'production', 'test'])

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url().min(1),
  },
  shared: {
    NODE_ENV: nodeEnv,
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
})
