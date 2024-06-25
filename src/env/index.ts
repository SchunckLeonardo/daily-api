import 'dotenv/config'
import { z } from 'zod'

const environmentVariablesSchema = z.object({
  PORT: z.coerce.number().default(3333),
})

export const env = environmentVariablesSchema.parse(process.env)
