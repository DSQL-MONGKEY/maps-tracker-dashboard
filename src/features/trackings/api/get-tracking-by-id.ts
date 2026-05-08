import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// This function handler used in server component so therefore use direct query to prisma not using NextRoute API
export async function getTrackingById(id: string) {
   try {
         const data = await prisma.tracking.findUnique({
            where: { 
               id: id 
            },
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
            return NextResponse.json({
               success: false,
               error: 'Tracking not found',
            }, { status: 404 });
         }
   
         return NextResponse.json({
            success: true,
            data,
         }, { status: 200 });
      
      } catch(error) {
   
         if(error instanceof Error) {
            return NextResponse.json({
               success: false,
               error: 'An error occurred while processing your request',
               details: error.message
            }, { status: 500 });
         }
      }
}