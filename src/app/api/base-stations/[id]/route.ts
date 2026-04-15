import prisma from '@/lib/prisma'; // Sesuaikan dengan path Prisma Client Anda
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prisma: Menggunakan findUnique untuk mengambil 1 baris berdasarkan ID
    const data = await prisma.baseStation.findUnique({
      where: { id }
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Base station not found'
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
    const { name, location_name, latitude, longitude, description, status } =
      body;

    // Prisma: Menggunakan update().
    // Catatan: Jika ID tidak ditemukan, Prisma akan melempar error P2025
    const data = await prisma.baseStation.update({
      where: { id },
      data: {
        name,
        locationName: location_name,
        latitude,
        longitude,
        description,
        status
      }
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Base station not found to update'
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prisma: Menggunakan delete().
    // Sama seperti update, akan melempar P2025 jika ID tidak ada.
    const data = await prisma.baseStation.delete({
      where: { id }
    });

    // Menangani kasus di mana ID tidak ditemukan saat delete
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Base station not found to delete'
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
