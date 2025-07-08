import { beforeEach } from 'vitest'
import { prisma } from '../lib/prisma'

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Url" RESTART IDENTITY CASCADE`)
})