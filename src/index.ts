import fastify from 'fastify'
import pino from 'pino'
import { Prisma, PrismaClient } from '@prisma/client'

const app = fastify()
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query", },
  ],
})

prisma.$on("query", async (e) => {
  logger.info(`Query: ${e.query}`)
  logger.info(`Params: ${e.params}`)
});

prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  logger.info(`Query took ${after - before}ms`)
  return result
})


interface IUserQueryString {
  firstName: string | null;
}

app.get<{
  Querystring: IUserQueryString
}>('/users', async (req, res) => {
  const { firstName } = req?.query

  const filter: Prisma.UserWhereInput = firstName ? {
    firstName: {
      equals: firstName
    }
  } : {}

  const posts = await prisma.user.findMany({
    where: {
      ...filter
    }
  })

  res.send(posts)
})

const start = async () => {
  try {
    await app.listen({ port: 3000 })
    /** 
     * Avoid Prisma's lazy connect behaviour — first request is slow 
     * Docs: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management
    */
    await prisma.$connect()
    console.log(`🚀 Server ready at: http://localhost:3000`)
  } catch (error) {
    app.log.error(error)
    await prisma.$disconnect()
    process.exit(1)
  }
}
start();

