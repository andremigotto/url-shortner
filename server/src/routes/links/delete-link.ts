import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db, links } from '@/infra/db/client'
import { eq } from 'drizzle-orm'

export async function deleteLinkRoute(app: FastifyInstance) {
  app.delete('/links/:slug', async (request, reply) => {
    const paramsSchema = z.object({
      slug: z.string().min(1),
    })

    const { slug } = paramsSchema.parse(request.params)

    const result = await db
        .delete(links)
        .where(eq(links.slug, slug))
        .returning()

    if (result.length === 0) {
      return reply.status(404).send({ error: 'Link não encontrado' })
    }

    return reply.status(204).send()
  })
}
