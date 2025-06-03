import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'


export async function POST(req: Request) {
   try {
      const body = await req.json();

      const { 
         device_code,
         latitude,
         longitude,
         altitude,
         rssi,
         message,
         snr,
         is_emergency
      } = body;

      const { data:device, error:deviceError } = await supabase
         .from('devices')
         .select('id')
         .eq('device_code', device_code)
         .single();
      
      if(deviceError || !device) {
         return NextResponse.json({
            success: false,
            error: 'Device code not found',
            details: deviceError.message
         }, { status: 404 });
      }

      const deviceDbId = device.id;

      const now = new Date().toISOString()
      const { data:register, error:registerErorr } = await supabase
         .from('register_devices')
         .select('climber_user_id, climber_users(name)')
         .eq('device_id', deviceDbId)
         .lte('registered_at', now)
         .or(`unregistered_at.is.null,unregistered_at.gte.${now}`)
         .limit(1)
         .maybeSingle()

      if(registerErorr || !register) {
         return NextResponse.json({
            success: false,
            error: 'Error registered device not found',
            details: registerErorr ? registerErorr.message : null 
         }, { status: 404 });
      }

      const climberId = register?.climber_user_id;

      const { data:trackingData, error:trackingsError } = await supabase
         .from('trackings')
         .insert({ 
            device_id: deviceDbId, 
            climber_user_id: climberId, 
            latitude, 
            longitude, 
            altitude, 
            rssi, 
            message, 
            snr, 
            is_emergency 
         })
         .select();

      if(trackingsError) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your add tracking request',
            details: trackingsError.message
         }, { status: 500});
      }

      return NextResponse.json({
         success: true,
         data: trackingData,
      }, { status: 201 });

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
         .select(`*, devices(name, type), climber_users(name)`)
         .order('created_at', { ascending: true });

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
