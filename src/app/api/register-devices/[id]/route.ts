import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params;
      
      const { data, error } = await supabase
         .from('register_devices')
         .select(`*, devices(name, type), climber_users(name)`)
         .eq('id', id)
         .single();

      if(error) {
         return NextResponse.json({
            success: false,
            error: 'Register id not found',
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params;
      const body = await req.json();
      const {
         climberUserId,
         deviceId,
         registeredAt,
         unregisteredAt,
         isActive
      } = body;


      const { data, error } = await supabase
         .from('register_devices')
         .update({
            climber_user_id: climberUserId,
            device_id: deviceId,
            registered_at: registeredAt,
            unregistered_at: unregisteredAt,
            is_active: isActive
         })
         .eq('id', id)
         .select()
         .single();

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
               details: error.message
            }, { status: 500 });
         }

   }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params;

      const { data, error } = await supabase
         .from('register_devices')
         .delete()
         .eq('id', id)
         .select()
         .single();

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

