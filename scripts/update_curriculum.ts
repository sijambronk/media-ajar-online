import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Resetting and synchronizing curriculum with provided image data...')

  // RESET DATA to ensure exact match with image
  console.log('Clearing existing Question, Asesmen, and Materi records...')
  await prisma.question.deleteMany({})
  await prisma.asesmen.deleteMany({})
  await prisma.materi.deleteMany({})

  // Ensure Categories exist
  const categories = [
    { name: 'Biologi' },
    { name: 'Fisika' },
    { name: 'Kimia' },
    { name: 'Bumi & Antariksa' }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    })
  }

  const biologiCat = await prisma.category.findUnique({ where: { name: 'Biologi' } })
  const fisikaCat = await prisma.category.findUnique({ where: { name: 'Fisika' } })
  const kimiaCat = await prisma.category.findUnique({ where: { name: 'Kimia' } })
  const bumiCat = await prisma.category.findUnique({ where: { name: 'Bumi & Antariksa' } })

  // Grade 7 Modules
  const g7Modules = [
    {
      title: 'Hakikat Sains & Pengukuran',
      kelas: 7, semester: 1, categoryId: fisikaCat!.id,
      cp: 'Menerapkan pengukuran terhadap aspek fisis dalam kehidupan sehari-hari.',
      tp: JSON.stringify([
        'Mengenal penggunaan aspek fisis dengan alat ukur yang tepat.',
        'Merancang dan melakukan penyelidikan ilmiah.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Hakikat Sains</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Metode Ilmiah:</strong> Langkah-langkah sistematis dalam penyelidikan.</li>
              <li><strong>Keamanan Laboratorium:</strong> Memahami simbol bahaya bahan kimia.</li>
              <li><strong>Alat Laboratorium:</strong> Pengenalan alat-alat ukur dan fungsinya.</li>
            </ul>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Pengukuran</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Besaran Pokok & Turunan:</strong> Membedakan jenis-jenis besaran.</li>
              <li><strong>Satuan SI:</strong> Penggunaan standar internasional.</li>
              <li><strong>Akurasi & Presisi:</strong> Ketelitian dalam pengukuran.</li>
              <li><strong>Konversi Satuan:</strong> Teknik mengubah satuan.</li>
              <li><strong>Teknik Pengukuran:</strong> Cara mengukur Panjang, Massa, Waktu, dan Volume.</li>
            </ul>
          </section>
        </div>
      `
    },
    {
      title: 'Klasifikasi Makhluk Hidup',
      kelas: 7, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menelaah hasil identifikasi makhluk hidup sesuai dengan karakteristiknya.',
      tp: JSON.stringify([
        'Menelaah hasil identifikasi makhluk hidup sesuai karakteristiknya.',
        'Menggunakan kunci dikotomi/determinasi.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Identifikasi</h3>
            <p>Memahami ciri-ciri makhluk hidup dan perbedaan antara komponen biotik (hidup) dan abiotik (tak hidup).</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Klasifikasi</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Sistem 5 Kingdom:</strong> Monera, Protista, Fungi, Plantae, Animalia.</li>
              <li><strong>Kunci Dikotomi:</strong> Cara mengklasifikasikan makhluk hidup berdasarkan ciri yang berlawanan.</li>
            </ul>
          </section>
        </div>
      `
    },
    {
      title: 'Klasifikasi & Sifat Zat',
      kelas: 7, semester: 1, categoryId: kimiaCat!.id,
      cp: 'Menganalisis klasifikasi, sifat, dan perubahan materi.',
      tp: JSON.stringify([
        'Menganalisis kualifikasi materi (unsur, senyawa, campuran).',
        'Membedakan sifat fisika dan kimia materi.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Komposisi Materi</h3>
            <p>Materi dibedakan menjadi Unsur, Senyawa, dan Campuran (Homogen/Heterogen).</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Karakteristik Materi</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Sifat Fisika & Kimia:</strong> Perbedaan mendalam antara perubahan fisik dan reaksi kimia.</li>
              <li><strong>Teknik Pemisahan Campuran:</strong> Filtrasi, Distilasi, Kromatografi, dll.</li>
            </ul>
          </section>
        </div>
      `
    },
    {
      title: 'Perubahan Zat & Massa Jenis',
      kelas: 7, semester: 1, categoryId: kimiaCat!.id,
      cp: 'Menganalisis klasifikasi, sifat, dan perubahan materi.',
      tp: JSON.stringify([
        'Menganalisis partikel materi dan perubahannya.',
        'Menentukan massa jenis benda.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Wujud Zat</h3>
            <p>Model partikel pada zat padat, cair, dan gas. Memahami siklus perubahan wujud (menguap, mengkristal, menyublim, dll).</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Massa Jenis</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Konsep Kerapatan:</strong> Hubungan massa dan volume.</li>
              <li><strong>Perhitungan:</strong> Rumus $\\rho = m/V$.</li>
              <li><strong>Efek Terapung/Tenggelam:</strong> Pengukuran massa jenis benda.</li>
            </ul>
          </section>
        </div>
      `
    },
    {
      title: 'Suhu, Kalor, & Pemuaian',
      kelas: 7, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Menganalisis pengaruh kalor dan perpindahannya terhadap perubahan suhu.',
      tp: JSON.stringify([
        'Menganalisis pengaruh kalor terhadap suhu dan wujud.',
        'Menganalisis mekanisme perpindahan kalor.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Suhu & Kalor</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Termometer:</strong> Alat pengukur suhu.</li>
              <li><strong>Skala Suhu:</strong> Celsius, Reamur, Fahrenheit, Kelvin.</li>
              <li><strong>Asas Black:</strong> Prinsip pencampuran kalor.</li>
            </ul>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Perpindahan & Pemuaian</h3>
            <ul class="list-disc ml-5 space-y-1">
              <li><strong>Jenis Perpindahan:</strong> Konduksi, Konveksi, Radiasi.</li>
              <li><strong>Pemuaian:</strong> Muai panjang, luas, dan volume pada jendela, rel kereta, bimetal.</li>
            </ul>
          </section>
        </div>
      `
    },
    {
      title: 'Gerak dan Gaya',
      kelas: 7, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Menganalisis ragam gerak, gaya, dan Hukum Newton.',
      tp: JSON.stringify([
        'Menganalisis ragam gerak benda.',
        'Menganalisis pengaruh gaya terhadap benda.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Gerak</h3>
            <p>Jarak, Perpindahan, Kelajuan, Kecepatan, GLB (Gerak Lurus Beraturan) & GLBB (Gerak Lurus Berubah Beraturan).</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Gaya & Hukum Newton</h3>
            <p>Gaya sentuh/tak sentuh, Resultan gaya ($\\Sigma F$), Hukum Newton I, II, dan III.</p>
          </section>
        </div>
      `
    },
    {
      title: 'Ekosistem & Perubahan Iklim',
      kelas: 7, semester: 2, categoryId: biologiCat!.id,
      cp: 'Menganalisis interaksi antar makhluk hidup dan lingkungannya dalam merancang solusi mengatasi perubahan iklim.',
      tp: JSON.stringify([
        'Menganalisis interaksi makhluk hidup dalam ekosistem.',
        'Merancang solusi mitigasi pencemaran iklim.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Ekologi</h3>
            <p>Komponen biotik/abiotik, Rantai makanan, Jaring-jaring makanan, Piramida makanan, dan Simbiosis.</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Isu Global</h3>
            <p>Pemanasan Global, Efek Rumah Kaca, serta Solusi adaptatif dan mitigatif terhadap perubahan iklim.</p>
          </section>
        </div>
      `
    }
  ]

  // Grade 8 Modules
  const g8Modules = [
    {
      title: 'Sel dan Mikroskop',
      kelas: 8, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan.',
      tp: JSON.stringify([
        'Menganalisis sel sebagai unit terkecil kehidupan.',
        'Menggunakan mikroskop untuk observasi.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Sel</h3>
            <p>Teori sel, Struktur sel hewan & tumbuhan, serta perbedaan organel-organel sel.</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Spesialisasi</h3>
            <p>Pemahaman tentang Spesialisasi sel, Jaringan, Organ, dan Sistem Organ.</p>
          </section>
        </div>
      `
    },
    {
      title: 'Sistem Pencernaan & Nutrisi',
      kelas: 8, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan, fungsi, serta kelainan pada sistem organ.',
      tp: JSON.stringify([
        'Mengenali fungsi organ pencernaan & enzim.',
        'Menganalisis kandungan nutrisi makanan.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Nutrisi</h3>
            <p>Karbohidrat, Protein, Lemak, Vitamin, Mineral, dan teknik Uji makanan.</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Anatomi & Fisik</h3>
            <p>Mulut, Lambung, Usus Halus, Usus Besar, Hati, Pankreas. Proses pencernaan kimiawi dan mekanik.</p>
          </section>
        </div>
      `
    },
    {
      title: 'Mata sebagai Indera & Pembentukan Bayangan',
      kelas: 8, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan, fungsi, serta kelainan pada sistem organ, dan menerapkan sifat gelombang (cahaya) serta pemanfaatannya.',
      tp: JSON.stringify([
        'Menganalisis struktur anatomi mata dan fungsinya.',
        'Menganalisis proses pembentukan bayangan pada mata.',
        'Menganalisis kelainan penglihatan dan solusinya.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Anatomi Mata</h3>
            <p>Kornea, Iris, Pupil, Lensa, Retina, dan Saraf Optik.</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Mekanisme Penglihatan</h3>
            <p>Pembentukan bayangan (nyata, terbalik, diperkecil) dan Daya Akomodasi Lensa. Gangguan seperti Miopi, Hipermetropi, dan alat optik bantu.</p>
          </section>
        </div>
      `
    },
    {
      title: 'Sistem Organ II: Koordinasi',
      kelas: 8, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan, fungsi, serta kelainan pada sistem organ.',
      tp: JSON.stringify([
        'Menganalisis cara kerja sistem saraf dan alat indera.',
        'Menerapkan fungsi sistem saraf dengan respon rangsang.',
        'Menganalisis peran hormon dalam koordinasi.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Sistem Saraf</h3>
            <p>Struktur neuron, Gerak Sadar & Refleks, Otak, dan Sumsum Tulang Belakang.</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Sistem Hormon & Indera</h3>
            <p>Kelenjar endokrin, serta fungsi Telinga, Kulit, Lidah, dan Hidung.</p>
          </section>
        </div>
      `
    },
    {
      title: 'Zat Aditif & Adiktif',
      kelas: 8, semester: 1, categoryId: kimiaCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan dan gangguan yang muncul.',
      tp: JSON.stringify([
        'Menganalisis pengaruh zat aditif dan adiktif terhadap kesehatan.'
      ]),
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Zat Aditif</h3>
            <p>Pewarna, Pemanis, Pengawet, Penyedap (Alami & Sintetik).</p>
          </section>
          <section>
            <h3 class="text-xl font-bold text-primary mb-3">Zat Adiktif</h3>
            <p>Narkotika, Psikotropika, serta dampak Kafein, Nikotin, dan Alkohol pada kesehatan.</p>
          </section>
        </div>
      `
    },
    {
      title: 'Sirkulasi & Respirasi',
      kelas: 8, semester: 2, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan, fungsi, serta kelainan pada sistem organ.',
      tp: JSON.stringify([
        'Menganalisis sistem peredaran darah.',
        'Menganalisis sistem pernapasan manusia.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Sirkulasi & Pernapasan</h3>
          <p>Jantung, Pembuluh darah, Golongan darah. Organ pernapasan (Hidung, Paru-paru), Mekanisme dada & perut, serta Kelainan (Asma, TBC, dll).</p>
        </div>
      `
    },
    {
      title: 'Sistem Ekskresi',
      kelas: 8, semester: 2, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan, fungsi, serta kelainan pada sistem organ.',
      tp: JSON.stringify([
        'Menganalisis fungsi alat ekskresi dan kelainan yang muncul.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Pembuangan Sisa Metablisme</h3>
          <p>Organ: Ginjal, Kulit, Hati, Paru-paru. Kesehatan: Albuminuria, Gagal Ginjal, Batu Ginjal, dll.</p>
        </div>
      `
    },
    {
      title: 'Usaha & Pesawat Sederhana',
      kelas: 8, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Menganalisis hubungan usaha dan energi.',
      tp: JSON.stringify([
        'Menganalisis hubungan usaha dan energi.',
        'Menerapkan prinsip pesawat sederhana.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Mekanika</h3>
          <p>Rumus Usaha ($W$), Daya ($P$), Energi ($EP$ & $EK$). Pesawat Sederhana: Tuas, Katrol, Bidang Miring, Skrup.</p>
        </div>
      `
    },
    {
      title: 'Tekanan Zat',
      kelas: 8, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Menganalisis ragam gerak, gaya, dan tekanan.',
      tp: JSON.stringify([
        'Menganalisis tekanan pada zat padat, cair, dan gas.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Tekanan</h3>
          <p>Tekanan Hidrostatis, Hukum Pascal, Hukum Archimedes, dan Tekanan Udara (Barometer).</p>
        </div>
      `
    }
  ]

  // Grade 9 Modules
  const g9Modules = [
    {
      title: 'Sistem Reproduksi & Kesehatan',
      kelas: 9, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menganalisis sistem organisasi kehidupan, fungsi, serta kelainan atau gangguan yang muncul.',
      tp: JSON.stringify([
        'Menganalisis fungsi sistem reproduksi dan upaya menjaga kesehatannya.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Reproduksi Manusia</h3>
          <p>Organ Pria & Wanita, Siklus Menstruasi, Fertilisasi, serta Penyakit Menular Seksual.</p>
        </div>
      `
    },
    {
      title: 'Pewarisan Sifat (Genetika)',
      kelas: 9, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menganalisis pewarisan sifat.',
      tp: JSON.stringify([
        'Memahami mekanisme pewarisan sifat.',
        'Menerapkan persilangan untuk pemuliaan.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Genetika</h3>
          <p>DNA, RNA, Gen, Kromosom. Hukum Mendel (Monohibrid & Dihibrid), serta Penerapan pada pemuliaan makhluk hidup.</p>
        </div>
      `
    },
    {
      title: 'Bioteknologi',
      kelas: 9, semester: 1, categoryId: biologiCat!.id,
      cp: 'Menerapkan bioteknologi konvensional di lingkungan sekitarnya.',
      tp: JSON.stringify([
        'Memahami prinsip bioteknologi konvensional.',
        'Membuat produk bioteknologi lokal.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Bioteknologi</h3>
          <p>Konvensional (Fermentasi) vs Modern (Rekayasa Genetika). Produk: Tempe, Tape, Yogurt, Keju.</p>
        </div>
      `
    },
    {
      title: 'Tata Surya',
      kelas: 9, semester: 1, categoryId: bumiCat!.id,
      cp: 'Menganalisis posisi relatif bumi-bulan-matahari.',
      tp: JSON.stringify([
        'Menganalisis posisi benda langit di tata sarya.',
        'Menjelaskan fenomena gerhana & fasa bulan.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Astronomi</h3>
          <p>Planet, Komet, Asteroid. Gerhana Matahari/Bulan, Rotasi & Revolusi, serta Pasang surut air laut.</p>
        </div>
      `
    },
    {
      title: 'Gelombang & Cahaya',
      kelas: 9, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Menganalisis gelombang dan pemanfaatannya.',
      tp: JSON.stringify([
        'Menganalisis gelombang dan gelombang bunyi.',
        'Menganalisis sifat cahaya dan alat optik.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Gelombang & Optik</h3>
          <p>Getaran, Frekuensi, Bunyi & Sonar Pantulan. Sifat cahaya (Pemantulan/Pembiasan), Indeks Bias, dan Hukum Snellius.</p>
        </div>
      `
    },
    {
      title: 'Kelistrikan & Magnet',
      kelas: 9, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Menganalisis gejala kemagnetan dan kelistrikan untuk menyelesaikan tantangan hidup.',
      tp: JSON.stringify([
        'Menganalisis rangkaian listrik arus DC (dinamis).',
        'Menganalisis gejala kemagnetan.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Listrik & Magnet</h3>
          <p>Hukum Coulomb (Statis), Hukum Ohm (Dinamis), Hukum Kirchhoff. Magnet: Elektromagnet, Gaya Lorentz, Induksi.</p>
        </div>
      `
    },
    {
      title: 'Energi Ramah Lingkungan',
      kelas: 9, semester: 2, categoryId: fisikaCat!.id,
      cp: 'Memahami sumber energi listrik ramah lingkungan.',
      tp: JSON.stringify([
        'Menganalisis pemanfaatan sumber energi listrik ramah lingkungan.'
      ]),
      content: `
        <div class="space-y-6">
          <h3 class="text-xl font-bold text-primary">Energi Terbarukan</h3>
          <p>Panel Surya, Turbin Angin, Hidroelektro, Biomassa. Teknologi ramah lingkungan dan penghematan energi.</p>
        </div>
      `
    }
  ]

  const allModules = [...g7Modules, ...g8Modules, ...g9Modules]

  for (const m of allModules) {
    process.stdout.write(`Creating: ${m.title} (Kelas ${m.kelas})... `)
    await prisma.materi.create({ data: m })
    console.log('OK')
  }

  console.log('\nCurriculum synchronization completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
