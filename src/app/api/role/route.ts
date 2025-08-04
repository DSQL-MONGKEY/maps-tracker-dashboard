import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
   try {
      const { userId } = await auth()

      if(!userId) {
         return NextResponse.json({
            error: 'Unauthorized'
         }, { status: 401 });
      }

      const { data }= await supabase
         .from('users')
         .select(`role`)
         .eq('id', userId)
         .single();

      if(data) {
         return NextResponse.json({
            success: true,
            data: {
               role: data.role
            },
         }, { status: 200});
      }

      // if user doesn't exist
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses[0]?.emailAddress;

      const { data:insertedData, error: insertError } = await supabase
         .from('users')
         .insert({
            id: userId,
            email,
            role: 'viewer',
         });
      
      if(insertError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to insert new user' 
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: insertedData,
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
