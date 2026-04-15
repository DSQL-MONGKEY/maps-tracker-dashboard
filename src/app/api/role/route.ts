import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    // 1. Cek apakah user sudah ada di database lokal
    // Menggunakan select agar query lebih ringan karena kita hanya butuh role
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          data: {
            role: existingUser.role
          }
        },
        { status: 200 }
      );
    }

    // 2. Jika user tidak ada, tarik data dari Clerk
    // Mengambil data dari Clerk hanya jika benar-benar perlu (menghemat limit API rate)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    // Proteksi tambahan: Pastikan email benar-benar didapatkan dari Clerk
    // karena skema Prisma Anda mewajibkan (NOT NULL) kolom email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'User email not found in Clerk provider'
        },
        { status: 400 }
      );
    }

    // 3. Insert user baru ke database
    const insertedUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        role: 'viewer' // Ini bisa dihilangkan jika @default("viewer") sudah ada di skema
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: insertedUser
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'An error occurred while processing your request',
          details: error.message
        },
        { status: 500 }
      );
    }
  }
}
