import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserAuthentication(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userId = req.cookies.userId

  if (!userId) {
    return res.status(401).send({
      status: 'Unauthorized',
    })
  }
}
