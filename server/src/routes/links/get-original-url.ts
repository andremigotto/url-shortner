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

    // Atualiza contador de cliques
    await db
      .update(links)
      .set({ clicks: link.clicks + 1 })
      .where(eq(links.id, link.id))

    // Função inline para garantir que a URL tenha protocolo
    function ensureProtocol(url: string): string {
      return /^https?:\/\//i.test(url) ? url : `http://${url}`
    }

    // Redirecionamento com protocolo garantido
    return reply.redirect(ensureProtocol(link.originalUrl))
  })
}
