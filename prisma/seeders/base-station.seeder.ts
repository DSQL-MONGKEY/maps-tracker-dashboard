import { PrismaClient, BaseStationStatus } from '@prisma/client';

export async function seedBaseStations(prisma: PrismaClient) {
  console.log('Seeding Base Stations...');

  const baseStations = [
    {
      id: 'a1b2c3d4-1234-5678-9012-111111111111',
      name: 'Gateway LoRa 433MHz - Basecamp',
      locationName: 'Basecamp Utama',
      latitude: -6.789123,
      longitude: 106.890123,
      description: 'Gateway penerima utama di area basecamp',
      status: BaseStationStatus.active
    },
    {
      id: 'a1b2c3d4-1234-5678-9012-222222222222',
      name: 'Gateway LoRa Pos 1',
      locationName: 'Pos 1 Pendakian',
      latitude: -6.785,
      longitude: 106.895,
      description: 'Gateway relay di Pos 1 ketinggian 1500mdpl',
      status: BaseStationStatus.active
    }
  ];

  for (const station of baseStations) {
    await prisma.baseStation.upsert({
      where: { id: station.id },
      update: {}, // Jika id sudah ada, lewati proses update agar data yang mungkin sudah diubah tidak tertimpa
      create: station
    });
  }

  console.log('✅ Base Stations seeded.');
}
