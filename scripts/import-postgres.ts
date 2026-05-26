import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  const exportPath = path.join(__dirname, '../../db-export.json')
  if (!fs.existsSync(exportPath)) {
    console.error(`Export file not found at ${exportPath}`)
    process.exit(1)
  }

  console.log('Loading export file...')
  const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'))

  console.log('Clearing existing database tables in PostgreSQL...')
  
  // Disable triggers/constraints in PostgreSQL if needed, or delete in order
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "_MateriToTP" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Result" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Student" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Kelas" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Question" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Asesmen" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Rpp" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Materi" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "TujuanPembelajaran" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "CapaianPembelajaran" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Category" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "SchoolProfile" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Profile" CASCADE;`)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`)

  console.log('Inserting Users...')
  for (const item of data.users) {
    await prisma.user.create({
      data: {
        id: item.id,
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Profiles...')
  for (const item of data.profiles) {
    await prisma.profile.create({
      data: {
        id: item.id,
        nip: item.nip,
        teacherName: item.teacherName,
        subject: item.subject,
        bio: item.bio,
        photoUrl: item.photoUrl,
        userId: item.userId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting School Profiles...')
  for (const item of data.schoolProfiles) {
    await prisma.schoolProfile.create({
      data: {
        id: item.id,
        name: item.name,
        npsn: item.npsn,
        address: item.address,
        phone: item.phone,
        email: item.email,
        principal: item.principal,
        logoUrl: item.logoUrl,
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Categories...')
  for (const item of data.categories) {
    await prisma.category.create({
      data: {
        id: item.id,
        name: item.name
      }
    })
  }

  console.log('Inserting Capaian Pembelajarans...')
  for (const item of data.capaianPembelajarans) {
    await prisma.capaianPembelajaran.create({
      data: {
        id: item.id,
        kode: item.kode,
        deskripsi: item.deskripsi,
        kelas: item.kelas,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Tujuan Pembelajarans...')
  for (const item of data.tujuanPembelajarans) {
    await prisma.tujuanPembelajaran.create({
      data: {
        id: item.id,
        kode: item.kode,
        deskripsi: item.deskripsi,
        cpId: item.cpId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Materis...')
  for (const item of data.materis) {
    await prisma.materi.create({
      data: {
        id: item.id,
        title: item.title,
        content: item.content,
        kelas: item.kelas,
        semester: item.semester,
        cp: item.cp,
        tp: item.tp,
        cpId: item.cpId,
        categoryId: item.categoryId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Rpps...')
  for (const item of data.rpps) {
    await prisma.rpp.create({
      data: {
        id: item.id,
        title: item.title,
        content: item.content,
        materiId: item.materiId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Asesmens...')
  for (const item of data.asesmens) {
    await prisma.asesmen.create({
      data: {
        id: item.id,
        title: item.title,
        type: item.type,
        materiId: item.materiId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Questions...')
  for (const item of data.questions) {
    await prisma.question.create({
      data: {
        id: item.id,
        text: item.text,
        options: item.options,
        answer: item.answer,
        type: item.type,
        asesmenId: item.asesmenId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Kelas...')
  for (const item of data.kelas) {
    await prisma.kelas.create({
      data: {
        id: item.id,
        name: item.name,
        tingkat: item.tingkat,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Students...')
  for (const item of data.students) {
    await prisma.student.create({
      data: {
        id: item.id,
        name: item.name,
        nisn: item.nisn,
        nis: item.nis,
        gender: item.gender,
        pob: item.pob,
        dob: item.dob ? new Date(item.dob) : null,
        address: item.address,
        waNumber: item.waNumber,
        kelasId: item.kelasId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Results...')
  for (const item of data.results) {
    await prisma.result.create({
      data: {
        id: item.id,
        score: item.score,
        answers: item.answers,
        studentId: item.studentId,
        asesmenId: item.asesmenId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    })
  }

  console.log('Inserting Materi-TP Relations...')
  for (const rel of data.materiToTpRels) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "_MateriToTP" ("A", "B") VALUES ('${rel.A}', '${rel.B}')
    `)
  }

  console.log('PostgreSQL migration completed successfully! All data imported.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
