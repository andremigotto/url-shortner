import { FastifyInstance } from 'fastify'
import { db, links } from '@/infra/db/client'
import { generateCsvFile } from '@/utils/generate-csv'
import { r2 } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'node:fs/promises'
import path from 'node:path'
import { env } from '@/env'

export async function exportCsvRoute(app: FastifyInstance) {
  app.post('/links/export', async (request, reply) => {
    const result = await db.select().from(links)
    const filePath = await generateCsvFile(result)
    const fileName = path.basename(filePath)

    const file = await fs.readFile(filePath)

    await r2.send(
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET,
        Key: fileName,
        Body: file,
        ContentType: 'text/csv',
      }),
    )

    const publicUrl = `${env.CLOUDFLARE_PUBLIC_URL}/${fileName}`

    return reply.send({ url: publicUrl })
  })
}
