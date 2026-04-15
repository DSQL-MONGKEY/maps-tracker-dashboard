import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { deviceCode, name, description, status, type } = payload;

    // Validasi
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Prisma: Menggunakan create() untuk melakukan insert data
    // Properti deviceCode otomatis dipetakan ke kolom device_code oleh Prisma sesuai skema
    const data = await prisma.device.create({
      data: {
        deviceCode,
        name,
        description,
        status,
        type
      }
    });

    return NextResponse.json(
      {
        success: true,
        data
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
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
    // Prisma: Menggunakan findMany() dengan argumen orderBy
    const data = await prisma.device.findMany({
      orderBy: {
        createdAt: 'desc' // Pastikan menggunakan camelCase 'createdAt' sesuai model Prisma
      }
    });

    return NextResponse.json(
      {
        data
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'An error occurred while fetching devices',
          details: error.message
        },
        { status: 500 }
      );
    }
  }
}
