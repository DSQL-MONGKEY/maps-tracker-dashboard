import { Separator } from '@/components/ui/separator'
import ClientMapWrapper from '@/features/maps/components/client-map-wrapper'
import React, { Suspense } from 'react'

export default function MapsCard() {
   return (
      <>
         <Separator />
            <Suspense>
               <div className='w-full p-2 flex justify-center overflow-hidden'>
                  <div className='w-full   h-full z-0'>
                     <ClientMapWrapper />
                  </div>
               </div>
            </Suspense>
      </>
   )
}
