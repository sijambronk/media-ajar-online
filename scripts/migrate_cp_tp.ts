import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting CP/TP Migration ---');
  
  const allMateri = await prisma.materi.findMany();
  console.log(`Found ${allMateri.length} Materi records.`);

  let migratedCP = 0;
  let migratedTP = 0;
  let linkedMateri = 0;

  for (const materi of allMateri) {
    if (!materi.cp) {
      console.log(`Skipping Materi [${materi.title}] - No legacy CP found.`);
      continue;
    }

    try {
      // 1. Find or create CapaianPembelajaran (CP)
      let cp = await prisma.capaianPembelajaran.findFirst({
        where: { 
          deskripsi: materi.cp as string,
          kelas: materi.kelas
        }
      });

      if (!cp) {
        cp = await prisma.capaianPembelajaran.create({
          data: {
            deskripsi: materi.cp as string,
            kelas: materi.kelas,
            kode: `CP.${materi.kelas}.${migratedCP + 1}`
          }
        });
        migratedCP++;
        console.log(`Created new CP for kelas ${materi.kelas}.`);
      }

      // 2. Link Materi to CP
      await prisma.materi.update({
        where: { id: materi.id },
        data: { cpId: cp.id }
      });

      // 3. Handle TujuanPembelajaran (TP)
      if (materi.tp) {
        let tpList: string[] = [];
        try {
          // Check if it's already a JSON string or something else
          if (materi.tp.startsWith('[')) {
            tpList = JSON.parse(materi.tp);
          } else {
            tpList = [materi.tp];
          }
        } catch (e) {
          tpList = [materi.tp];
        }

        if (Array.isArray(tpList)) {
          for (const tpDesc of tpList) {
            if (!tpDesc) continue;

            let tp = await prisma.tujuanPembelajaran.findFirst({
              where: { 
                deskripsi: tpDesc,
                cpId: cp.id
              }
            });

            if (!tp) {
              tp = await prisma.tujuanPembelajaran.create({
                data: {
                  deskripsi: tpDesc,
                  cpId: cp.id,
                  kode: `TP.${migratedTP + 1}`
                }
              });
              migratedTP++;
            }

            // Connect Materi to TP
            await prisma.materi.update({
              where: { id: materi.id },
              data: {
                tpRelations: {
                  connect: { id: tp.id }
                }
              }
            });
          }
        }
      }

      linkedMateri++;
      console.log(`Processed Materi: ${materi.title}`);
    } catch (error) {
      console.error(`Failed to process Materi [${materi.title}]:`, error);
    }
  }

  console.log('--- Migration Completed ---');
  console.log(`Unique CP created: ${migratedCP}`);
  console.log(`Unique TP created: ${migratedTP}`);
  console.log(`Materi successfully linked: ${linkedMateri}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
