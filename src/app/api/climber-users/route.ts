import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const {
         name,
         phone,
         email,
         address,
      } = body;

      const { data: climberData, error: climberError } = await supabase
         .from('climber_users')
         .insert({
            name,
            phone,
            email,
            address
         })
         .select();

         if(climberError) {
            return NextResponse.json({
               success: false,
               error: 'Error creating climber user',
               details: climberError.message
            }, { status: 500 });
         }

         return NextResponse.json({
            success: true,
            data: climberData,
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
      .from('climber_users')
      .select('*')
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