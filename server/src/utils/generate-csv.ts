import fs from 'node:fs'
import path from 'node:path'
import { format } from 'fast-csv'
import { randomUUID } from 'crypto'
import { env } from '@/env'

interface LinkRecord {
  originalUrl: string
  slug: string
  clicks: number
  createdAt: Date
}

export async function generateCsvFile(data: LinkRecord[]) {
  const fileName = `${randomUUID()}.csv`
  const filePath = path.resolve('src', 'tmp', fileName)

  await new Promise<void>((resolve, reject) => {
    const ws = fs.createWriteStream(filePath)
    const csvStream = format({ headers: true })

    csvStream.pipe(ws).on('finish', () => resolve()).on('error', reject)

    data.forEach((row) => {
      csvStream.write({
        originalUrl: row.originalUrl,
        shortUrl: `${env.DEFAULT_SHORT_URL}/${row.slug}`,
        clicks: row.clicks,
        createdAt: row.createdAt.toISOString(),
      })
    })

    csvStream.end()
  })

  return filePath
}
