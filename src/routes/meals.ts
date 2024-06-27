import { FastifyInstance } from 'fastify'
import { verifyUserAuthentication } from '../middlewares/verify-user-authentication'
import { z } from 'zod'
import { prisma } from '../app'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyUserAuthentication)

  app.delete('/:id', async (req, res) => {
    const paramsDeleteMealSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsDeleteMealSchema.parse(req.params)

    try {
      await prisma.meal.delete({
        where: {
          id,
        },
      })

      return res.status(204).send({ status: 'deleted' })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return res.status(404).send({ status: 'id not found' })
        }
      }
      return res
        .status(500)
        .send({ status: `An unexpected error occurred: ${err}` })
    }
  })

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
      name: z.string().optional(),
      description: z.string().optional(),
      dateAndHour: z.string().optional(),
      inRegimen: z.boolean().optional(),
    })

    const { id } = paramsEditMealSchema.parse(req.params)
    const { dateAndHour, description, inRegimen, name } =
      bodyEditMealSchema.parse(req.body)

    try {
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

      return res.status(200).send({ status: 'updated', meal: mealUpdated })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return res.status(404).send({ status: 'id not found' })
        }
      }
      return res
        .status(500)
        .send({ status: `An unexpected error occurred: ${err}` })
    }
  })
}
