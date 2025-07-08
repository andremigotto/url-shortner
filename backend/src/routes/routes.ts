import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { nanoid } from 'nanoid'
import { env } from '../env'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export async function urlsRoutes(app: FastifyInstance) {
  const UrlCodeParamsSchema = z.object({
    code: z.string().min(1),
  })

  const CreateUrlBodySchema = z.object({
    originalUrl: z
      .string()
      .regex(/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, {
        message: 'URL inválida',
      }),
  })

  const UrlResponseSchema = z.object({
    id: z.string().uuid(),
    originalUrl: z.string().url(),
    shortCode: z.string(),
    accessCount: z.number(),
    createdAt: z.string(),
  })

  const AnalyticsResponseSchema = z.object({
    originalUrl: z.string().url(),
    accessCount: z.number(),
    createdAt: z.string(),
  })

  // POST /urls
  app.post('/urls', {
    schema: {
      summary: 'Criar URL encurtada',
      tags: ['URLs'],
      body: {
        type: 'object',
        properties: {
          originalUrl: {
            type: 'string',
            description: 'A URL a ser encurtada',
          },
        },
        required: ['originalUrl'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            shortUrl: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    let { originalUrl } = CreateUrlBodySchema.parse(request.body)

    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      originalUrl = `https://${originalUrl}`
    }

    const shortCode = nanoid(6)

    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
      },
    })

    return reply.status(201).send({
      shortUrl: `${env.BASE_URL}/${url.shortCode}`,
    })
  })

  // GET /:code
  app.get('/:code', {
    schema: {
      summary: 'Redirecionar para URL original',
      tags: ['URLs'],
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            minLength: 1,
            description: 'Código curto gerado na criação',
          },
        },
        required: ['code'],
      },
      response: {
        302: { description: 'Redireciona para a URL original' },
        404: { description: 'Código inválido ou não encontrado' },
      },
    },
  }, async (request, reply) => {
    const { code } = UrlCodeParamsSchema.parse(request.params)

    const url = await prisma.url.findUnique({
      where: { shortCode: code },
    })

    if (!url) {
      return reply.status(404).send({ error: 'URL not found' })
    }

    await prisma.url.update({
      where: { id: url.id },
      data: { accessCount: { increment: 1 } },
    })

    return reply.redirect(url.originalUrl)
  })

  // GET /urls
  app.get('/urls', {
    schema: {
      summary: 'Listar todas as URLs encurtadas',
      tags: ['URLs'],
      response: {
        200: {
          type: 'array',
          items: zodToJsonSchema(UrlResponseSchema),
        },
      },
    },
  }, async () => {
    return prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
    })
  })

  // DELETE /urls/:code
  app.delete('/urls/:code', {
    schema: {
      summary: 'Deletar uma URL encurtada',
      tags: ['URLs'],
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            minLength: 1,
            description: 'Código curto da URL a ser deletada',
          },
        },
        required: ['code'],
      },
      response: {
        204: { description: 'URL deletada com sucesso' },
        404: { description: 'Código não encontrado' },
      },
    },
  }, async (request, reply) => {
    const { code } = UrlCodeParamsSchema.parse(request.params)

    const url = await prisma.url.findUnique({ where: { shortCode: code } })

    if (!url) {
      return reply.status(404).send({ message: 'URL not found' })
    }

    await prisma.url.delete({ where: { id: url.id } })

    return reply.status(204).send()
  })

  // GET /urls/:code/analytics
  app.get('/urls/:code/analytics', {
    schema: {
      summary: 'Relatório de acessos da URL',
      tags: ['URLs'],
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            minLength: 1,
            description: 'Código da URL encurtada',
          },
        },
        required: ['code'],
      },
      response: {
        200: zodToJsonSchema(AnalyticsResponseSchema),
        404: { description: 'Código não encontrado' },
      },
    },
  }, async (request, reply) => {
    const { code } = UrlCodeParamsSchema.parse(request.params)

    const url = await prisma.url.findUnique({
      where: { shortCode: code },
      select: {
        originalUrl: true,
        accessCount: true,
        createdAt: true,
      },
    })

    if (!url) {
      return reply.status(404).send({ message: 'URL not found' })
    }

    return reply.send(url)
  })
}
