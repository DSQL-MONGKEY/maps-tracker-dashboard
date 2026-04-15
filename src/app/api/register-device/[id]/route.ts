import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prisma: Menggunakan findUnique dan include untuk memuat relasi (JOIN)
    const data = await prisma.registerDevice.findUnique({
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
          error: 'Register id not found'
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
    const { climberUserId, deviceId, registeredAt, unregisteredAt, isActive } =
      body;

    // 1. Validasi Keberadaan Climber User
    const climberUser = await prisma.climberUser.findUnique({
      where: { id: climberUserId },
      select: { id: true }
    });

    if (!climberUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Climber user not found'
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
          error: 'Device not found'
        },
        { status: 404 }
      );
    }

    // 3. Eksekusi Update
    const register = await prisma.registerDevice.update({
      where: { id },
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

    const data = await prisma.registerDevice.delete({
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
