import prisma from '@/lib/prisma';

export const getClimberById = async (climberId: string) => {
  try {
    // Prisma: findUnique dengan include untuk mereplikasi join relasi
    const climber = await prisma.climberUser.findUnique({
      where: {
        id: climberId
      },
      include: {
        // Mengambil semua kolom climber, plus HANYA kolom deviceId dari tabel registerDevices
        registerDevices: {
          select: {
            deviceId: true
          }
        }
      }
    });

    return climber;
  } catch (error) {
    return null;
  }
};
