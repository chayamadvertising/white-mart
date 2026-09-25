const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'jubujubair257@gmail.com';
  const password = '54453555';
  
  // Create salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Jubu'
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Jubu'
    }
  });
  
  console.log('Success: Admin user created/updated ->', user.email);
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
