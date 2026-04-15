import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location_name, latitude, longitude, description, status } =
      body;

    const data = await prisma.baseStation.create({
      data: {
        name,
        locationName: location_name,
        latitude,
        longitude,
        description,
        status
      }
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
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
    const data = await prisma.baseStation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch base stations',
          details: error.message
        },
        { status: 500 }
      );
    }
  }
}
