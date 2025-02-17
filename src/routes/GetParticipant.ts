import { ClientError } from '@/errors/ClientError'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/participants/:participantId',
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { participantId } = req.params

      const participant = await prisma.participant.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true,
        },
        where: { id: participantId },
      })

      if (!participant) {
        throw new ClientError('Participant not found.')
      }

      return reply.send({ participant })
    }
  )
}
