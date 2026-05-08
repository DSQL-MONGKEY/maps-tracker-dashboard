import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function getRegisterById(id: string) {
   try {
         const data = await prisma.registerDevice.findUnique({
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
               error: 'Registered device not found'
            }, { status: 404 });
         }
   
         return NextResponse.json({
            success: true,
            data 
         }, { status: 200 });
   
      } catch (error) {
   
         if(error instanceof Error) {
            return NextResponse.json({
               success: false,
               error: 'An error occurred while fetching devices',
               details: error.message
            }, { status: 500 });
         }
   
      }
}