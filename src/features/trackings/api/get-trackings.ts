import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// This function handler used in server component so therefore use direct query to supabase not using NextRoute API
export async function getTrackings() {
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