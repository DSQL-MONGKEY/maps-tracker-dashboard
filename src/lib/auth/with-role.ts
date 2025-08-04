import { auth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";
import { supabase } from "../supabase/server";


export async function requireRole(allowedRoles: string[] = ['admin']) {
   const { userId } = await auth();

   if(!userId) {
      return NextResponse.json({
         error: 'Unauthorized' 
      }, { status: 401 });
   }

   const { data, error } = await supabase
   .from('users')
   .select('role')
   .eq('id', userId)
   .single();

   if(error || !data) {
      return NextResponse.json({
         error: 'Access denied'
      }, { status: 403 });
   }

   return null;
}