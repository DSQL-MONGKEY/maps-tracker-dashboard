import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding Users (Dashboard Admins/Viewers)...');

  const users = [
    {
      id: 'user_2xyz123admin', // Contoh ID format Clerk
      email: 'admin.gunung@example.com',
      role: 'admin'
    },
    {
      id: 'user_2abc456viewer',
      email: 'relawan.pos1@example.com',
      role: 'viewer'
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        // Khusus untuk tabel User, mungkin kita ingin update role jika ada perubahan di seeder
        role: user.role
      },
      create: user
    });
  }

  console.log('✅ Users seeded.');
}
