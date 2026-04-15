import { PrismaClient } from '@prisma/client';

// Memodifikasi prototype bawaan JavaScript agar BigInt bisa di-serialize menjadi string dalam JSON

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
