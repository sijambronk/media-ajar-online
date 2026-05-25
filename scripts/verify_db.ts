import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const materiCount = await prisma.materi.count()
  const asesmenCount = await prisma.asesmen.count()
  const categories = await prisma.category.findMany({
    include: { _count: { select: { materi: true } } }
  })

  console.log('--- Database Verification ---')
  console.log(`Total Materi: ${materiCount}`)
  console.log(`Total Asesmen: ${asesmenCount}`)
  console.log('Categories:')
  categories.forEach(c => {
    console.log(`- ${c.name}: ${c._count.materi} materi`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
