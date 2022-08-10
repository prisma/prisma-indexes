import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

const data = Array.from({ length: 500000 }).map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
}))

async function main() {
  console.log(`📻 Elevator music cues..`)
  const [_,response] = await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.user.createMany({
      data,
    })
  ])
  console.log(`${response.count} records created`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
