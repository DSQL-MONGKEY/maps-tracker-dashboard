import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function getRegistereById(id: string) {
   try {
   
         const { data, error } = await supabase
            .from('register_devices')
            .select(`*, devices(name, type), climber_users(name)`)
            .eq('id', id)
            .limit(1)
            .single();
   
         if(error) {
            return NextResponse.json({
               error: 'Failed to fetch devices'
            }, { status: 500});
         }
   
         return NextResponse.json({
            success: true,
            data 
         }, { status: 200 })
   
      } catch (error) {
   
         if(error instanceof Error) {
            return NextResponse.json({
               success: false,
               error: 'An error occurred while fetching devices',
               details: error.message
            }, { status: 500 });
         }
   
      }
}