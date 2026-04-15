import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { climberUserId, deviceId, registeredAt, unregisteredAt, isActive } =
      body;

    // 1. Validasi Keberadaan Climber User
    const climberUser = await prisma.climberUser.findUnique({
      where: { id: climberUserId },
      select: { id: true } // Hanya ambil ID untuk efisiensi
    });

    if (!climberUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Climber user id not found'
        },
        { status: 404 }
      );
    }

    // 2. Validasi Keberadaan Device
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      select: { id: true }
    });

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device id not found'
        },
        { status: 404 }
      );
    }

    // 3. Validasi Perangkat Sedang Dipakai
    // Menggunakan findFirst karena kita mencari baris apa saja yang sesuai kriteria
    const activeRegister = await prisma.registerDevice.findFirst({
      where: {
        deviceId: deviceId,
        unregisteredAt: null // Sama dengan .is('unregistered_at', null) di Supabase
      },
      select: { id: true }
    });

    if (activeRegister) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device is already registered to another user'
        },
        { status: 400 }
      );
    }

    // 4. Proses Insert
    const register = await prisma.registerDevice.create({
      data: {
        climberUserId,
        deviceId,
        registeredAt,
        unregisteredAt,
        isActive
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: register
      },
      { status: 201 }
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

export async function GET() {
  try {
    // Prisma: Menggunakan include untuk melakukan operasi JOIN pada relasi tabel
    const data = await prisma.registerDevice.findMany({
      include: {
        device: {
          select: { name: true, type: true }
        },
        climberUser: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(
      {
        success: true,
        data
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
