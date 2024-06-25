import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../app'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { email, name, password } = createUserBodySchema.parse(req.body)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    return res.status(401).send({
      status: 'created',
      user,
    })
  })
}
