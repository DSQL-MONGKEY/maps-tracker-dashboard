import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
   try {

      const payload = await req.json();
      const { name, description } = payload;


      // Validasi
      if (!name || !description) {
         return NextResponse.json(
            { error: 'Name and description are required' },
            { status: 400 }
         );
      }

      const { data, error } = await supabase
         .from('devices')
         .insert([{ name, description }])
         .select()

      if (error) {
         return NextResponse.json({
            error: 'Failed to insert data into database'
         }, { status: 500 }
         );
      }

      return NextResponse.json({ 
         success: true, 
         data 
      }, { status: 201 });

   } catch (error) {

      if (error instanceof Error) {
         return NextResponse.json({
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });
      }

   }
}

export async function GET() {
   try {

      const { data, error } = await supabase
         .from('devices')
         .select('*')
         .order('created_at', { ascending: false });

      if(error) {
         return NextResponse.json({
            error: 'Failed to fetch devices'
         }, { status: 500});
      }

      return NextResponse.json({
         data 
      }, { status: 200 })

   } catch (error) {

      if(error instanceof Error) {
         return NextResponse.json({
            error: 'An error occurred while fetching devices',
            details: error.message
         }, { status: 500 });
      }

   }
}