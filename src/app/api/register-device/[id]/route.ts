import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params;
         
         const { data, error } = await supabase
            .from('climber_users')
            .select('*')
            .eq('id', id)
            .single();
   
         if(error) {
            return NextResponse.json({
               success: false,
               error: 'Climber data not found',
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
         name,
         phone,
         email,
         address
      } = body;


      const { data, error } = await supabase
         .from('climber_users')
         .update({
            name,
            phone,
            email,
            address
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
         .from('climber_users')
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

