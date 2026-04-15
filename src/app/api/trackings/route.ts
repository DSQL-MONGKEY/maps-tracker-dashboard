import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      device_code,
      latitude,
      longitude,
      altitude, // Pastikan kolom ini sudah ditambahkan di schema.prisma
      rssi,
      message, // Pastikan kolom ini sudah ditambahkan di schema.prisma
      snr,
      is_emergency
    } = body;

    // 1. Validasi dan Ambil ID Device berdasarkan device_code
    const device = await prisma.device.findUnique({
      where: { deviceCode: device_code },
      select: { id: true }
    });

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device code not found'
        },
        { status: 404 }
      );
    }

    const deviceDbId = device.id;
    const now = new Date(); // Prisma menggunakan object Date bawaan JS

    // 2. Cari Climber yang sedang memakai device ini (sesi aktif)
    const register = await prisma.registerDevice.findFirst({
      where: {
        deviceId: deviceDbId,
        registeredAt: { lte: now }, // less than or equal to 'now'
        OR: [
          { unregisteredAt: null },
          { unregisteredAt: { gte: now } } // greater than or equal to 'now'
        ]
      },
      select: {
        climberUserId: true
        // Kita tidak perlu men-select climberUser(name) di sini jika tidak digunakan di insert
      }
    });

    if (!register) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error: Active registered device session not found'
        },
        { status: 404 }
      );
    }

    const climberId = register.climberUserId;

    // 3. Insert Tracking Data
    const trackingData = await prisma.tracking.create({
      data: {
        deviceId: deviceDbId,
        climberUserId: climberId,
        latitude,
        longitude,
        altitude, // Hapus baris ini jika kolom tidak ada di database
        rssi,
        message, // Hapus baris ini jika kolom tidak ada di database
        snr,
        isEmergency: is_emergency
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: trackingData
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'An error occurred while processing your add tracking request',
          details: error.message
        },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  try {
    const data = await prisma.tracking.findMany({
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
