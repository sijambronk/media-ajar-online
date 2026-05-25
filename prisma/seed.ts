import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@science.id' },
    update: {},
    create: {
      email: 'admin@science.id',
      name: 'Admin IPA',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = ['Biologi', 'Fisika', 'Kimia', 'Astronomi', 'Geologi']
  const categoryRecords: any = {}
  for (const name of categories) {
    categoryRecords[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // Sample Materi
  const sampleMateris = [
    { title: 'Sel dan Mikroskop', kelas: 7, semester: 1, category: 'Biologi' },
    { title: 'Wujud Zat dan Perubahannya', kelas: 7, semester: 1, category: 'Kimia' },
    { title: 'Sel: Unit Terkecil Kehidupan', kelas: 8, semester: 1, category: 'Biologi' },
    { title: 'Hukum Newton', kelas: 8, semester: 1, category: 'Fisika' },
    { title: 'Sistem Koordinasi Manusia', kelas: 9, semester: 1, category: 'Biologi' },
  ]

  for (const s of sampleMateris) {
    await prisma.materi.upsert({
      where: { id: `sample-${s.title.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `sample-${s.title.toLowerCase().replace(/\s+/g, '-')}`,
        title: s.title,
        content: `Materi tentang ${s.title}. Pelajari konsep dasar dan contoh soal di sini.`,
        kelas: s.kelas,
        semester: s.semester,
        categoryId: categoryRecords[s.category].id
      }
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
