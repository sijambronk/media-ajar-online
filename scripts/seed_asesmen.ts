import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding interactive assessments for all 23 modules...')

  const allMateri = await prisma.materi.findMany()

  for (const m of allMateri) {
    const existingAsesmen = await prisma.asesmen.findFirst({
      where: { materiId: m.id }
    })

    if (existingAsesmen) {
      console.log(`Asesmen already exists for: ${m.title}. Skipping.`)
      continue
    }

    process.stdout.write(`Creating Asesmen for: ${m.title}... `)

    let questions: any[] = []

    // Custom questions based on title
    if (m.title.includes('Hakikat Sains')) {
      questions = [
        {
          text: 'Langkah pertama dalam metode ilmiah adalah...',
          options: JSON.stringify(['Hipotesis', 'Observasi', 'Eksperimen', 'Kesimpulan']),
          answer: 'Observasi'
        },
        {
          text: 'Besaran pokok untuk waktu dalam satuan SI adalah...',
          options: JSON.stringify(['Jam', 'Menit', 'Sekon', 'Hari']),
          answer: 'Sekon'
        }
      ]
    } else if (m.title.includes('Klasifikasi Makhluk Hidup')) {
      questions = [
        {
          text: 'Kingdom yang terdiri dari organisme prokariotik (bakteri) adalah...',
          options: JSON.stringify(['Monera', 'Protista', 'Fungi', 'Plantae']),
          answer: 'Monera'
        },
        {
          text: 'Ciri utama makhluk hidup yang membedakannya dari benda mati adalah...',
          options: JSON.stringify(['Berat', 'Warna', 'Iritabilitas', 'Ukuran']),
          answer: 'Iritabilitas'
        }
      ]
    } else if (m.title.includes('Zat')) {
       questions = [
        {
          text: 'Rumus kimia air adalah $H_2O$. Air termasuk dalam kategori...',
          options: JSON.stringify(['Unsur', 'Senyawa', 'Campuran Heterogen', 'Logam']),
          answer: 'Senyawa'
        },
        {
          text: 'Metode pemisahan campuran berdasarkan perbedaan titik didih disebut...',
          options: JSON.stringify(['Filtrasi', 'Distilasi', 'Sublimasi', 'Kromatografi']),
          answer: 'Distilasi'
        }
      ]
    } else if (m.title.includes('Suhu')) {
      questions = [
        {
          text: 'Suhu titik didih air pada skala Celsius adalah...',
          options: JSON.stringify(['0 °C', '32 °C', '100 °C', '273 °C']),
          answer: '100 °C'
        },
        {
          text: 'Perpindahan panas melalui pancaran tanpa zat perantara disebut...',
          options: JSON.stringify(['Konduksi', 'Konveksi', 'Radiasi', 'Isolasi']),
          answer: 'Radiasi'
        }
      ]
    } else if (m.title.includes('Gerak')) {
      questions = [
        {
          text: 'Rumus Hukum Newton II adalah...',
          options: JSON.stringify(['$F = m \\cdot a$', '$\\Sigma F = 0$', '$Aksi = Reaksi$', '$v = s/t$']),
          answer: '$F = m \\cdot a$'
        }
      ]
    } else if (m.title.includes('Sel')) {
      questions = [
        {
          text: 'Bagian sel yang berfungsi sebagai pusat kendali adalah...',
          options: JSON.stringify(['Mitokondria', 'Nukleus', 'Ribosom', 'Sitoplasma']),
          answer: 'Nukleus'
        }
      ]
    } else if (m.title.includes('Pencernaan')) {
      questions = [
        {
          text: 'Enzim yang terdapat di lambung untuk mencerna protein adalah...',
          options: JSON.stringify(['Amilase', 'Pepsin', 'Lipase', 'Ptialin']),
          answer: 'Pepsin'
        }
      ]
    } else {
      // Default questions for others
      questions = [
        {
          text: `Apa tujuan utama mempelajari '${m.title}' dalam Sains IPA?`,
          options: JSON.stringify(['Menghafal rumus', 'Memahami fenomena alam', 'Lulus ujian saja', 'Menjadi ilmuwan']),
          answer: 'Memahami fenomena alam'
        },
        {
          text: `Manakah yang benar mengenai konsep dasar dalam '${m.title}'?`,
          options: JSON.stringify(['Hanya teori', 'Berdasarkan bukti ilmiah', 'Tidak berubah', 'Pendapat pribadi']),
          answer: 'Berdasarkan bukti ilmiah'
        }
      ]
    }

    await prisma.asesmen.create({
      data: {
        title: `Kuis: ${m.title}`,
        materiId: m.id,
        type: 'QUIZ',
        questions: {
          create: questions
        }
      }
    })

    console.log('Done')
  }

  console.log('\nAll assessments seeded successfully.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
