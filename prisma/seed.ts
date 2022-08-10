import { PrismaClient } from '@prisma/client'
import data from './users.json'
const prisma = new PrismaClient()

async function main() {
  console.log(`📻 Elevator music cues..`)
  const response = await prisma.user.createMany({
    // @ts-ignore
    data,
  })
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
