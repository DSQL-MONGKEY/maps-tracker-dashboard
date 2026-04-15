import { PrismaClient } from '@prisma/client';

export async function seedLogs(prisma: PrismaClient) {
  console.log('Seeding Logs...');

  const logs = [
    {
      // Menggunakan tipe data BigInt bawaan JavaScript
      source: 'System',
      level: 'INFO',
      message: 'LoRa Tracking System Initialized successfully',
      createdAt: new Date(new Date().getTime() - 10000) // 10 detik yang lalu
    },
    {
      source: 'Gateway_Basecamp',
      level: 'WARNING',
      message: 'High latency detected on packet transmission',
      createdAt: new Date(new Date().getTime() - 5000) // 5 detik yang lalu
    },
    {
      source: 'Device_Manager',
      level: 'ERROR',
      message: 'Failed to parse telemetry payload from TRK-002',
      createdAt: new Date() // Sekarang
    }
  ];

  for (const log of logs) {
    await prisma.log.upsert({
      where: { id: 1 },
      update: {}, // Biarkan kosong agar tidak menimpa data historis jika sudah ada
      create: log
    });
  }

  console.log('✅ Logs seeded.');
}
