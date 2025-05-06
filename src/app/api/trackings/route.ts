import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'


export async function POST(req: Request) {
   try {
      const body = await req.json();

      const { 
         device_id,
         latitude,
         longitude,
         altitude,
         rssi,
         message,
         snr,
         is_emergency
      } = body;

      const { data, error } = await supabase
         .from('trackings')
         .insert({ 
            device_id, latitude, longitude, altitude, rssi, message, snr, is_emergency 
         })
         .select();

      if(error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500});
      }

      return NextResponse.json({
         success: true,
         data,
      }, { status: 201});

   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500});
      }

   }
}

export async function GET() {
   try {

      const { data, error }= await supabase
         .from('trackings')
         .select(`*, devices(name, type)`)
         .order('created_at', { ascending: false });

      if(error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500});
      }

      return NextResponse.json({
         success: true,
         data,
      }, { status: 200});

   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message,
         }, { status: 500});
      }

   }
}
