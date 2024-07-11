import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { createTrip } from './routes/CreateTrip'
import { confirmTrip } from './routes/ConfirmTrip'
import { confirmParticipant } from './routes/ConfirmParticipant'
import { createActivity } from './routes/CreateActivity'
import { getActivities } from './routes/GetActivities'
import { createLink } from './routes/CreateLink'
import { getLinks } from './routes/GetLinks'
import { getParticipants } from './routes/GetParticipants'
import { getParticipant } from './routes/GetParticipant'
import { createInvite } from './routes/CreateInvite'

export const app = fastify()

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(getParticipant)
app.register(createInvite)
