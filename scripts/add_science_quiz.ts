import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const materi = await prisma.materi.findFirst({
    where: { title: 'Sel dan Mikroskop' }
  })

  if (!materi) {
    console.log('Materi not found')
    return
  }

  await prisma.asesmen.create({
    data: {
      title: 'Kuis Sains & Formula',
      materiId: materi.id,
      type: 'QUIZ',
      questions: {
        create: [
          {
            text: 'Berapakah jumlah atom oksigen dalam produk fotosintesis: $C_6H_{12}O_6 + 6O_2$?',
            type: 'PILGAN',
            options: JSON.stringify(['6', '12', '18', '24']),
            answer: '18'
          },
          {
            text: 'Rumus kimia air adalah $H_2O$. Berapa perbandingan atom H dan O?',
            type: 'PILGAN',
            options: JSON.stringify(['1:1', '2:1', '1:2', '2:2']),
            answer: '2:1'
          }
        ]
      }
    }
  })

  console.log('Advanced quiz added')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
