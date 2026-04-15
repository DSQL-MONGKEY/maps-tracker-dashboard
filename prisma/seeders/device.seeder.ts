import { PrismaClient, DeviceType } from '@prisma/client';

export async function seedDevices(prisma: PrismaClient) {
  console.log('Seeding Devices...');

  const devices = [
    {
      id: 'c3d4e5f6-3456-7890-1234-111111111111',
      name: 'Tracker GPS-LoRa 01',
      description: 'Perangkat tracker client yang dibawa oleh pendaki (Node 1)',
      type: DeviceType.client_device,
      status: true,
      deviceCode: 'TRK-001'
    },
    {
      id: 'c3d4e5f6-3456-7890-1234-222222222222',
      name: 'Tracker GPS-LoRa 02',
      description: 'Perangkat tracker client yang dibawa oleh pendaki (Node 2)',
      type: DeviceType.client_device,
      status: true,
      deviceCode: 'TRK-002'
    },
    {
      id: 'c3d4e5f6-3456-7890-1234-333333333333',
      name: 'Repeater LoRa Pos 2',
      description: 'Perangkat extender untuk memperluas jangkauan sinyal',
      type: DeviceType.extender_device,
      status: true,
      deviceCode: 'RPT-001'
    }
  ];

  for (const device of devices) {
    await prisma.device.upsert({
      where: { id: device.id }, // upsert juga bisa menggunakan field @unique seperti name atau deviceCode
      update: {},
      create: device
    });
  }

  console.log('✅ Devices seeded.');
}
