import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching existin admin user...');
  
  // Find the existing admin
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.log('No admin found, creating one...');
    const hashedPassword = await bcrypt.hash('admin', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Created new admin user.');
  } else {
    console.log('Updating existing admin credentials...');
    const hashedPassword = await bcrypt.hash('admin', 10);
    admin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        email: 'admin',
        password: hashedPassword
      }
    });
    console.log('Updated existing admin user.');
  }
  
  console.log('Success! Username and Password are now both "admin"');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
