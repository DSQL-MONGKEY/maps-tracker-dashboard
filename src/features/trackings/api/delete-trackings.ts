import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DeleteTracking(id: string) {
   try {

      const { data, error } = await supabase
      .from('trackings')
      .delete()
      .eq('id', id)
      .select(`*, devices(name, type)`);

      
      if (error) {
         return NextResponse.json({
            success: false,
            error: 'Tracking not found',
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