import { dayjs } from '@/lib/dayjs'
import { prisma } from '@/lib/prisma'
import { getMailClient } from '@/mail/nodemailer'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { env } from '@/env'

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/trips/:tripId/invite',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (req, reply) => {
      const { tripId } = req.params
      const { email } = req.body

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      })

      if (!trip) {
        throw new Error('Trip not found.')
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      })

      const formattedTripStartDate = dayjs(trip.starts_at).format('D[ de ]MMMM')
      const formattedTripEndDate = dayjs(trip.ends_at).format('D[ de ]MMMM')

      const mail = await getMailClient()

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

      return reply.status(204).send()
    }
  )
}
