import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

const data = Array.from({ length: 1000000 }).map(() => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const email = faker.internet.email(firstName, lastName)
  
  return {
    firstName, lastName, email
  }
})
async function main() {
  console.log(`📻 Elevator music cues..`)
  const [_, users] = await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.user.createMany({
      data,
    })
  ])
  console.log(`${users.count} records created`)
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
