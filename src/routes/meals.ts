import { FastifyInstance } from 'fastify'
import { verifyUserAuthentication } from '../middlewares/verify-user-authentication'
import { z } from 'zod'
import { prisma } from '../app'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyUserAuthentication)

  app.post('/', async (req, res) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateAndHour: z.string(),
      inRegimen: z.boolean(),
    })

    const { dateAndHour, description, inRegimen, name } =
      createMealBodySchema.parse(req.body)

    const userId = req.cookies.userId

    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        dateAndHour,
        inRegimen,
        userId: userId!,
      },
    })

    res.status(201).send({ status: 'created', meal })
  })

  app.put('/:id', async (req, res) => {
    const paramsEditMealSchema = z.object({
      id: z.string().uuid(),
    })

    const bodyEditMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      dateAndHour: z.string(),
      inRegimen: z.boolean(),
    })

    const { id } = paramsEditMealSchema.parse(req.params)
    const { dateAndHour, description, inRegimen, name } =
      bodyEditMealSchema.parse(req.body)

    const mealUpdated = await prisma.meal.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        dateAndHour,
        inRegimen,
      },
    })

    if (!mealUpdated) {
      return res.status(404).send({ status: 'ID not found' })
    }

    return res.status(200).send({ status: 'updated' })
  })
}
