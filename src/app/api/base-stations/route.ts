import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const {
         name,
         location_name,
         latitude,
         longitude,
         description,
         status,
      } = body;

      const { data, error } = await supabase
         .from('base_stations')
         .insert({
            name,
            location_name,
            latitude,
            longitude,
            description,
            status,
         })
         .select();
      
      if(error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data,
      }, { status: 201 });

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

export async function GET() {
   try {
      const { data, error } = await supabase
         .from('base_stations')
         .select('*')
         .order('created_at', { ascending: false });

         if(error) {
            return NextResponse.json({
               success: false,
               error: 'Failed to fetch base stations',
            }, { status: 500 });
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