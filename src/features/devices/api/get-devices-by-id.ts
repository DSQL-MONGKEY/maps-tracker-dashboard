import prisma from '@/lib/prisma';

export async function getDeviceById(id: string) {
  try {
    // Prisma: Ambil data secara langsung
    const device = await prisma.device.findUnique({
      where: { id }
    });

    // Akan mereturn objek device jika ada, atau null jika id tidak ditemukan
    return device;
  } catch (error) {
    return null;
  }
}
