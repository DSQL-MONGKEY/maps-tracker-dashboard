import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";



export async function GET(req: Request,  { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await params;

      const { data, error } =  await supabase
         .from('devices')
         .select('*')
         .eq('id', id)
         .single();

      if(error) {
         return NextResponse.json({
            error: 'Device not found',
         }, { status: 404 });
      }

      return NextResponse.json({
         success: true,
         data,
      }, { status: 200 });

   } catch (error) {
      if(error instanceof Error) {
         return NextResponse.json({
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });
      }
   }
}

export async function PUT(req: Request, params: { id: string }) {
   try {

      const { id } = await params;
      const body = await req.json();
      const { name, description } = body;

      if(!name || !description) {
         return NextResponse.json({
            error: 'Name and description are required'
         }, { status: 400 });
      }

      const { data, error } = await supabase
         .from('devices')
         .update({ name, description })
         .eq('id', id)
         .select()
         .single();


      if(error) {
         return NextResponse.json({
            error: 'Failed to update data',
            message: error.message
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data
      }, { status: 200 });

   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });
      }

   }
}

export async function DELETE(req: Request, params: { id: string }) {
   try {

      const { id } = await params;
      const {data, error} = await supabase
         .from('devices')
         .delete()
         .eq('id', id)
         .select();
      
      if(error) {
         return NextResponse.json({
            error: 'Failed to delete data',
            message: error.message
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         message: 'Device deleted successfully',
         data,
      }, { status: 200 });
   
   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });
      }

   }
}