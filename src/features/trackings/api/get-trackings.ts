import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// This function handler used in server component so therefore use direct query to prisma not using NextRoute API
export async function getTrackings() {
   try {
         const data = await prisma.tracking.findMany({
            include: {
               device: {
                  select: { name: true, type: true }
               }
            },
            orderBy: {
               createdAt: 'desc'
            }
         });
   
         return NextResponse.json({
            success: true,
            data,
         }, { status: 200 });
   
      } catch(error) {
   
         if(error instanceof Error) {
            return NextResponse.json({
               success: false,
               error: 'An error occurred while processing your request',
               details: error.message,
            }, { status: 500 });
         }
   
      }
}