import { PrismaClient } from '@prisma/client';

export async function seedTrackings(prisma: PrismaClient) {
  console.log('Seeding Trackings...');

  const now = new Date();

  const trackings = [
    // --- Simulasi Pergerakan Pendaki 1 (Dimas, TRK-001) ---
    {
      // REVISI: Menggunakan karakter hex yang valid (0-9, a-f)
      id: 'e5f6a7b8-5678-9012-3456-111111111111',
      deviceId: 'c3d4e5f6-3456-7890-1234-111111111111',
      climberUserId: 'b2c3d4e5-2345-6789-0123-111111111111',
      rssi: 100,
      snr: 5.2,
      latitude: -6.786,
      longitude: 106.892,
      isEmergency: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000) // 30 menit lalu
    },
    {
      id: 'e5f6a7b8-5678-9012-3456-111111111112',
      deviceId: 'c3d4e5f6-3456-7890-1234-111111111111',
      climberUserId: 'b2c3d4e5-2345-6789-0123-111111111111',
      rssi: 100,
      snr: 2.1,
      latitude: -6.7845,
      longitude: 106.8945,
      isEmergency: false,
      createdAt: new Date(now.getTime() - 15 * 60 * 1000) // 15 menit lalu
    },

    // --- Simulasi Pergerakan Pendaki 2 (Elin, TRK-002) - Simulasi Darurat ---
    {
      id: 'e5f6a7b8-5678-9012-3456-222222222221',
      deviceId: 'c3d4e5f6-3456-7890-1234-222222222222',
      climberUserId: 'b2c3d4e5-2345-6789-0123-222222222222',
      rssi: 100,
      snr: -2.5,
      latitude: -6.78,
      longitude: 106.899,
      isEmergency: true,
      createdAt: new Date(now.getTime() - 5 * 60 * 1000) // 5 menit lalu
    }
  ];

  for (const tracking of trackings) {
    await prisma.tracking.upsert({
      where: { id: tracking.id },
      update: {},
      create: tracking
    });
  }

  console.log('✅ Trackings seeded.');
}
