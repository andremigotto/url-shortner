import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { db, links } from '@/infra/db/client'
import { eq } from 'drizzle-orm'
import { env } from '@/env'

function generateSlug() {
  return randomUUID().slice(0, 8)
}

export async function createLinkRoute(app: FastifyInstance) {
  app.post('/links', async (request, reply) => {
  try {
    const bodySchema = z.object({
      originalUrl: z.string().url({ message: 'URL original inválida' }),
      slug: z
        .string()
        .min(3, { message: 'Slug deve ter pelo menos 3 caracteres' })
        .max(255, { message: 'Slug deve ter no máximo 255 caracteres' })
        .regex(/^[a-zA-Z0-9_-]+$/, {
          message: 'Slug deve conter apenas letras, números, hífen e underline',
        })
        .optional(),
    })

    const { originalUrl, slug: providedSlug } = bodySchema.parse(request.body)
    const slug = providedSlug ?? generateSlug()

    const existing = await db
      .select()
      .from(links)
      .where(eq(links.slug, slug))

    if (existing.length > 0) {
      return reply.status(409).send({ error: 'Slug já existe' })
    }

    await db.insert(links).values({ originalUrl, slug })

    return reply.status(201).send({
      shortUrl: `${env.DEFAULT_SHORT_URL}/${slug}`,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Validation Error',
        issues: err.errors,
      })
    }

    throw err
  }
}
  )
}
