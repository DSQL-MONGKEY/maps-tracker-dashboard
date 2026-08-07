import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ekstrak semua field sesuai dengan JSON yang dikirim dari Gateway C++
    const {
      device_code,
      timestamp,
      latitude,
      longitude,
      temperature,
      humidity,
      pressure,
      heart_rate,
      spo2,
      is_emergency,
      is_fallen,
      hop_count,
      routing_path,
      gateway_rssi,
      gateway_snr
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
    const now = new Date();

    // 2. Cari Climber yang sedang memakai device ini (sesi aktif)
    const register = await prisma.registerDevice.findFirst({
      where: {
        deviceId: deviceDbId,
        registeredAt: { lte: now },
        OR: [{ unregisteredAt: null }, { unregisteredAt: { gte: now } }]
      },
      select: {
        climberUserId: true
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

    // Konversi UNIX epoch (detik) dari GPS ke objek Date JS (milidetik)
    // Jika GPS belum fix (timestamp 0), fallback ke null agar database rapi

    const receivedTimestamp = timestamp;
    const MIN_VALID_TS = 1577836800;
    const finalTimestamp = (receivedTimestamp && receivedTimestamp > MIN_VALID_TS)
    ? receivedTimestamp
    : Math.floor(Date.now() / 1000);

    // 3. Insert Tracking Data ke Database
    const trackingData = await prisma.tracking.create({
      data: {
        deviceId: deviceDbId,
        climberUserId: climberId,
        latitude,
        longitude,
        deviceTime: finalTimestamp, // Waktu aktual dari GPS
        temperature,
        pressure,
        humidity,
        heartRate: heart_rate,
        spo2,
        isEmergency: is_emergency || false,
        isFallen: is_fallen || false,
        rssi: gateway_rssi,
        snr: gateway_snr,
        hopCount: hop_count,
        routingPath: routing_path || [] // Memasukkan array dari Extender
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '10', 10);
    const search = searchParams.get('search') || '';
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];

    const skip = (page - 1) * perPage;

    // Build where clause for search and category filters
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { device: { name: { contains: search, mode: 'insensitive' } } },
        { climberUser: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (categories.length > 0) {
      const hasEmergency = categories.includes('true');
      const hasFallen = categories.includes('false');

      if (hasEmergency && hasFallen) {
        where.AND = [
          { isEmergency: true },
          { isFallen: false }
        ];
      } else if (hasEmergency) {
        where.isEmergency = true;
      } else if (hasFallen) {
        where.isFallen = false;
      }
    }

    const [data, totalCount] = await Promise.all([
      prisma.tracking.findMany({
        where,
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
        },
        skip,
        take: perPage
      }),
      prisma.tracking.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json(
      {
        success: true,
        data,
        totalCount,
        page,
        perPage,
        totalPages
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
