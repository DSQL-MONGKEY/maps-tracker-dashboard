import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function POST(req: Request) {
   const body = await req.json()

   const { device_id, latitude, longitude } = body

   const { data, error } = await supabase.from('positions').insert([
      { device_id, latitude, longitude }
   ])

   if (error) {
      console.error("Gagal insert Supabase:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
   }

   return NextResponse.json({ success: true, data })
}
