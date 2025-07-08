import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'node:path'

import { createLinkRoute } from './routes/links/create-link'
import { deleteLinkRoute } from './routes/links/delete-link'
import { getOriginalUrlRoute } from './routes/links/get-original-url'
import { listLinksRoute } from './routes/links/list-links'
import { exportCsvRoute } from './routes/links/export-csv'

export const app = Fastify()

app.register(cors)

app.register(fastifyStatic, {
  root: path.resolve(__dirname, '..', 'tmp'),
  prefix: '/public/',
})

app.register(createLinkRoute)
app.register(deleteLinkRoute)
app.register(getOriginalUrlRoute)
app.register(listLinksRoute)
app.register(exportCsvRoute)
