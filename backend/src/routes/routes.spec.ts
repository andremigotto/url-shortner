import request from 'supertest'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { buildApp } from '../app'
import { prisma } from '../lib/prisma'
import { env } from '../env'

const app = buildApp()

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Encurtador de URLs - Rotas', () => {
  it('deve encurtar uma URL e retornar a shortUrl completa', async () => {
    const response = await request(app.server)
      .post('/urls')
      .send({ originalUrl: 'https://rocketseat.com.br' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('shortUrl')
    expect(response.body.shortUrl).toMatch(new RegExp(`^${env.BASE_URL}/[\\w-]+$`))
  })

  it('deve retornar 400 se a URL for inválida', async () => {
    const response = await request(app.server)
      .post('/urls')
      .send({ originalUrl: 'url_invalida' })

    expect(response.statusCode).toBe(400)
  })

  it('deve redirecionar corretamente usando um shortCode existente', async () => {
    const createResponse = await request(app.server)
      .post('/urls')
      .send({ originalUrl: 'https://github.com' })

    const shortUrl = createResponse.body.shortUrl
    const code = shortUrl.split('/').pop()

    const redirectResponse = await request(app.server).get(`/${code}`)

    expect(redirectResponse.statusCode).toBe(302)
    expect(redirectResponse.headers.location).toBe('https://github.com')
  })

  it('deve deletar um link encurtado existente', async () => {
    const createResponse = await request(app.server)
      .post('/urls')
      .send({ originalUrl: 'https://example.com' })

    expect(createResponse.statusCode).toBe(201)

    const shortUrl = createResponse.body.shortUrl
    const code = shortUrl.split('/').pop()

    const deleteResponse = await request(app.server)
      .delete(`/urls/${code}`)

    expect(deleteResponse.statusCode).toBe(204)

    const result = await prisma.url.findUnique({ where: { shortCode: code } })
    expect(result).toBeNull()
  })

  it('deve retornar o relatório de acessos de uma URL encurtada', async () => {
  // Cria uma URL encurtada
  const createResponse = await request(app.server)
    .post('/urls')
    .send({ originalUrl: 'https://analytics.com' })

  const shortUrl = createResponse.body.shortUrl
  const code = shortUrl.split('/').pop()

  // Acessa a URL encurtada duas vezes para incrementar o contador
  await request(app.server).get(`/${code}`)
  await request(app.server).get(`/${code}`)

  // Consulta o relatório de analytics
  const analyticsResponse = await request(app.server)
    .get(`/urls/${code}/analytics`)

  expect(analyticsResponse.statusCode).toBe(200)

  expect(analyticsResponse.body).toEqual(
    expect.objectContaining({
      originalUrl: 'https://analytics.com',
      accessCount: 2,
      createdAt: expect.any(String),
    })
  )
})

})
