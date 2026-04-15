import { PrismaClient } from '@prisma/client';

export async function seedClimberUsers(prisma: PrismaClient) {
  console.log('Seeding Climber Users...');

  const climbers = [
    {
      id: 'b2c3d4e5-2345-6789-0123-111111111111',
      name: 'Dimas Prasetyo',
      phone: '081234567890',
      email: 'dimas@example.com',
      address: 'Depok'
    },
    {
      id: 'b2c3d4e5-2345-6789-0123-222222222222',
      name: 'Elin',
      phone: '081298765432',
      email: 'elin@example.com',
      address: 'Bumi'
    },
    {
      id: 'b2c3d4e5-2345-6789-0123-333333333333',
      name: 'Nasya',
      phone: '081211223344',
      email: 'nasya@example.com',
      address: 'Jakarta'
    }
  ];

  for (const climber of climbers) {
    await prisma.climberUser.upsert({
      where: { id: climber.id },
      update: {},
      create: climber
    });
  }

  console.log('✅ Climber Users seeded.');
}
