import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await prisma.tracking.findUnique({
      where: { id },
      include: {
        device: {
          select: { name: true, type: true }
        },
        climberUser: {
          select: { name: true }
        }
      }
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tracking not found'
        },
        { status: 404 }
      );
    }

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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Ekstrak semua field yang mungkin diperbarui dari payload dashboard
    const {
      deviceId,
      climberUserId,
      timestamp,
      latitude,
      longitude,
      temperature,
      pressure,
      humidity,
      heart_rate,
      spo2,
      is_emergency,
      is_fallen,
      rssi,
      snr,
      hop_count,
      routing_path
    } = body;

    // Konversi timestamp ke Date object jika disediakan
    const deviceTimeObj = timestamp ? new Date(timestamp * 1000) : undefined;

    const data = await prisma.tracking.update({
      where: { id },
      data: {
        deviceId,
        climberUserId,
        latitude,
        longitude,
        deviceTime: deviceTimeObj,
        temperature,
        pressure,
        humidity,
        // Pengecekan undefined agar Prisma tidak me-reset data yang tidak ingin diubah
        heartRate: heart_rate !== undefined ? heart_rate : undefined,
        spo2: spo2 !== undefined ? spo2 : undefined,
        isEmergency: is_emergency !== undefined ? is_emergency : undefined,
        isFallen: is_fallen !== undefined ? is_fallen : undefined,
        rssi,
        snr,
        hopCount: hop_count !== undefined ? hop_count : undefined,
        routingPath: routing_path !== undefined ? routing_path : undefined
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await prisma.tracking.delete({
      where: { id }
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
