import Fastify from 'fastify'
import { ZodError } from 'zod'
import { urlsRoutes } from './routes/routes'
import FastifySwagger from '@fastify/swagger'
import FastifySwaggerUI from '@fastify/swagger-ui'
import cors from '@fastify/cors'  // importe o plugin
import { env } from './env'

export function buildApp() {
  const app = Fastify()

  // Habilita CORS para seu frontend (ajuste origin conforme ambiente)
  app.register(cors, {
    origin: ['http://localhost:5173'], // frontend rodando no vite padrão
  })

  // 📘 Swagger: documentação OpenAPI
  app.register(FastifySwagger, {
    openapi: {
      info: {
        title: 'URL Shortener API',
        description: 'API para encurtar, listar e gerenciar links.',
        version: '1.0.0',
      },
      servers: [
        {
          url: env.BASE_URL,
        },
      ],
    },
  })

  // 💻 Interface Swagger visual
  app.register(FastifySwaggerUI, {
    routePrefix: '/docs',
  })

  app.register(urlsRoutes)

  // ⚠️ Tratamento global de erros
  app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error.',
        issues: error.format(),
      })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Internal server error.' })
  })

  return app
}
