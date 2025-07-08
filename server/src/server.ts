import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`🚀 HTTP server running on port ${env.PORT}`)
  })
  .catch((err) => {
    console.error('❌ Failed to start server', err)
    process.exit(1)
  })
