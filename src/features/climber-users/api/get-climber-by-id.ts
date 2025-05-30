import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const getClimberById = async (climberId: string) => {
   try {
      const { data:climber, error:climberError } = await supabase
         .from('climber_users')
         .select(`*, register_devices(device_id)`)
         .eq('id', climberId)
         .single();

      if (climberError) {
         return NextResponse.json({
            error: 'Failed to fetch climber'
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: climber
      }, { status: 200 });
   
   } catch(error) {

      if (error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while fetching climber',
            details: error.message
         }, { status: 500 });
      }

   }
}