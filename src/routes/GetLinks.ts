import { ClientError } from '@/errors/ClientError'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/trips/:tripId/links',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { tripId } = req.params

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          links: true,
        },
      })

      if (!trip) {
        throw new ClientError('Trip not found')
      }

      return reply.send({ links: trip.links })
    }
  )
}
