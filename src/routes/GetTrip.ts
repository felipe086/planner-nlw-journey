import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/trips/:tripId',
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
        select: {
          id: true,
          destination: true,
          starts_at: true,
          ends_at: true,
          is_confirmed: true,
        },
        where: { id: tripId },
      })

      if (!trip) {
        throw new Error('Trip not found')
      }

      return reply.send({ trip })

      // const trip = await prisma.trip.findUnique({
      //   select: {
      //     id: true,
      //     destination: true,
      //     starts_at: true,
      //     ends_at: true,
      //     is_confirmed: true,
      //     participants: {
      //       select: {
      //         id: true,
      //         name: true,
      //         email: true,
      //         is_confirmed: true,
      //       },
      //     },
      //     activities: {
      //       select: {
      //         id: true,
      //         title: true,
      //         occurs_at: true,
      //       },
      //     },
      //     links: {
      //       select: {
      //         id: true,
      //         title: true,
      //         url: true,
      //       },
      //     },
      //   },
      //   where: { id: tripId },
      // })
    }
  )
}
