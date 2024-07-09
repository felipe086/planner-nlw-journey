import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { createTrip } from './routes/CreateTrip'

export const app = fastify()

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
