import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const nodeEnv = process.env.NODE_ENV ?? 'development'

// Define o caminho do arquivo .env com base no ambiente
const envFilePath = path.resolve(
  __dirname,
  '..',
  nodeEnv === 'test' ? '.env.test' : '.env'
)

// Lê e aplica as variáveis de ambiente do arquivo selecionado
const parsedEnv = dotenv.parse(fs.readFileSync(envFilePath))

for (const key in parsedEnv) {
  process.env[key] = parsedEnv[key]
}

// ✅ Logs para depuração
console.log('✅ NODE_ENV:', nodeEnv)
console.log('✅ DATABASE_URL:', process.env.DATABASE_URL)

// ✅ Proteção contra uso incorreto de banco nos testes
if (
  nodeEnv === 'test' &&
  !process.env.DATABASE_URL?.includes('url_shortener_test')
) {
  throw new Error('❌ Banco de dados incorreto para ambiente de teste!')
}

// Validação com Zod
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  BASE_URL: z.string().url(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
