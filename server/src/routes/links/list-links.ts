import { FastifyInstance } from 'fastify'
import { db, links } from '@/infra/db/client'
import { z } from 'zod'

export async function listLinksRoute(app: FastifyInstance) {
  app.get('/links', async (request, reply) => {
    const querySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      perPage: z.coerce.number().min(1).max(100).default(10),
    })

    const { page, perPage } = querySchema.parse(request.query)

    const offset = (page - 1) * perPage

    const result = await db
      .select()
      .from(links)
      .orderBy(links.createdAt)
      .limit(perPage)
      .offset(offset)

    return reply.send({ links: result })
  })
}
