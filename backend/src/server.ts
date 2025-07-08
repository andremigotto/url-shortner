import { buildApp } from './app'
import { env } from './env'

const app = buildApp()

app.listen({ port: 3333 }, () => {
  console.log(`🚀 HTTP server running at ${env.BASE_URL}`)
})