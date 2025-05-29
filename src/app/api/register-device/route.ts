import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const {
         climberUserId,
         deviceId,
         registeredAt,
         unregisteredAt,
         isActive
      } = body;

      const { data:climberUser, error:climberError } = await supabase
         .from('climber_users')
         .select('id')
         .eq('id', climberUserId)
         .single();

      if(climberError || !climberUser) {
         return NextResponse.json({
            success: false,
            error: 'Climber user id not found',
            details: climberError.message
         }, { status: 404 });
      }
      const climberUserDbId = climberUser.id;

      const { data:device, error:deviceError } = await supabase
         .from('devices')
         .select('id')
         .eq('id', deviceId)
         .single();
      
      if(deviceError || !device) {
         return NextResponse.json({
            success: false,
            error: 'Device id not found',
            details: deviceError.message
         }, { status: 404 });
      }
      const deviceDbId = device.id;

      const { data:register, error:registerError } = await supabase
         .from('register_devices')
         .insert({
            device_id: deviceDbId,
            climber_user_id: climberUserDbId,
            registered_at: registeredAt,
            unregistered_at: unregisteredAt,
            is_active: isActive
         })
         .select();

         if(registerError) {
            return NextResponse.json({
               success: false,
               error: 'Error creating climber user',
               details: registerError.message
            }, { status: 500 });
         }

         return NextResponse.json({
            success: true,
            data: register,
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
      const { data, error } = await supabase
      .from('register_devices')
      .select(`*, devices(name, type), climber_users(name)`)
      .order('created_at', { ascending: false });

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