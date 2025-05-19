import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params;
         
         const { data, error } = await supabase
            .from('base_stations')
            .select('*')
            .eq('id', id)
            .single();
   
         if(error) {
            return NextResponse.json({
               success: false,
               error: 'Base station not found',
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
         location_name,
         latitude,
         longitude,
         description,
         status,
      } = body;


      const { data, error } = await supabase
         .from('base_stations')
         .update({
            name,
            location_name,
            latitude,
            longitude,
            description,
            status,
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
         .from('base_stations')
         .delete()
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

