import { env } from '@/env'
import { ClientError } from '@/errors/ClientError'
import { dayjs } from '@/lib/dayjs'
import { getMailClient } from '@/lib/nodemailer'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import nodemailer from 'nodemailer'
import { z } from 'zod'

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/trips/:tripId/confirm',
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
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      })

      if (!trip) {
        throw new ClientError('Trip not found')
      }

      if (trip.is_confirmed) {
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      })

      const formattedTripStartDate = dayjs(trip.starts_at).format('D[ de ]MMMM')
      const formattedTripEndDate = dayjs(trip.ends_at).format('D[ de ]MMMM')

      const mail = await getMailClient()

      Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = new URL(
            `/api/participants/${participant.id}/confirm`,
            env.API_BASE_URL
          )

          const sendedEmail = await mail.sendMail({
            from: {
              name: 'Equipe plann.er',
              address: 'contato@plann.er',
            },
            to: participant.email,
            subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedTripStartDate}`,
            html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado(a) para participar de uma viagem para <strong>${
                trip.destination
              }</strong> nas datas de ${formattedTripStartDate} até ${formattedTripEndDate}.</p>
              <p></p>
              <p>Para confirmar sua presença viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${confirmationLink.toString()}">Confirmar viagem</a>
              </p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim(),
          })
          console.log(nodemailer.getTestMessageUrl(sendedEmail))
        })
      )

      return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
    }
  )
}
