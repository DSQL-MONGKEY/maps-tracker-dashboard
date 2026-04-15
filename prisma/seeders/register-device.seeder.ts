import { PrismaClient } from '@prisma/client';

export async function seedRegisterDevices(prisma: PrismaClient) {
  console.log('Seeding Register Devices...');

  const now = new Date();
  const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 hari yang lalu

  const registers = [
    {
      id: 'd4e5f6a7-4567-8901-2345-111111111111',
      // ID milik Dimas Prasetyo (dari 02-climber-user.seeder.ts)
      climberUserId: 'b2c3d4e5-2345-6789-0123-111111111111',
      // ID milik Tracker 01 (dari 03-device.seeder.ts)
      deviceId: 'c3d4e5f6-3456-7890-1234-111111111111',
      registeredAt: now,
      unregisteredAt: null, // Masih aktif mendaki
      isActive: true
    },
    {
      id: 'd4e5f6a7-4567-8901-2345-222222222222',
      // ID milik Elin
      climberUserId: 'b2c3d4e5-2345-6789-0123-222222222222',
      // ID milik Tracker 02
      deviceId: 'c3d4e5f6-3456-7890-1234-222222222222',
      registeredAt: pastDate,
      unregisteredAt: now, // Sudah selesai mendaki hari ini
      isActive: false
    }
  ];

  for (const register of registers) {
    await prisma.registerDevice.upsert({
      where: { id: register.id },
      update: {},
      create: register
    });
  }

  console.log('✅ Register Devices seeded.');
}
