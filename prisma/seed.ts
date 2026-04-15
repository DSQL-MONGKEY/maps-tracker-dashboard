import { PrismaClient } from '@prisma/client';
import { seedBaseStations } from './seeders/base-station.seeder';
import { seedClimberUsers } from './seeders/climber-user.seeder';
import { seedDevices } from './seeders/Device.seeder';
import { seedUsers } from './seeders/User.seeder';
import { seedRegisterDevices } from './seeders/register-device.seeder';
import { seedTrackings } from './seeders/Tracking.seeder';
import { seedLogs } from './seeders/Log.seeder';

// Inisialisasi instance Prisma Client tunggal
const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Start seeding database...');

  await seedBaseStations(prisma);
  await seedClimberUsers(prisma);
  await seedDevices(prisma);
  await seedUsers(prisma);
  await seedRegisterDevices(prisma);
  await seedTrackings(prisma);
  await seedLogs(prisma);

  console.log('🎉 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Pastikan koneksi ditutup setelah selesai
    await prisma.$disconnect();
  });
