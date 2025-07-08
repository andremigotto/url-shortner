import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db, links } from '@/infra/db/client'
import { eq } from 'drizzle-orm'

export async function getOriginalUrlRoute(app: FastifyInstance) {
  app.get('/:slug', async (request, reply) => {
    const paramsSchema = z.object({
      slug: z.string().min(1),
    })

    const { slug } = paramsSchema.parse(request.params)

    const result = await db
      .select()
      .from(links)
      .where(eq(links.slug, slug))

    const link = result[0]

    if (!link) {
      return reply.status(404).send({ error: 'Link não encontrado' })
    }

    await db
      .update(links)
      .set({ clicks: link.clicks + 1 })
      .where(eq(links.id, link.id))

    return reply.status(200).send({ originalUrl: link.originalUrl })
  })
}
