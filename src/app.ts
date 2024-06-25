import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/user'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

export const prisma = new PrismaClient()

app.register(cookie)
app.register(userRoutes, { prefix: 'user' })
