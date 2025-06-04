'use client';

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBuildingLighthouse, IconDeviceAirtag } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";


export function DevicesCard() {
   const { data:response, isLoading } = useSWR('/api/devices', fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
   });

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription>Total Devices</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {isLoading ? (
                  <Skeleton
                     className="w-20 h-2"
                  />
               ) : (response?.data.length)}
            </CardTitle>
            <CardAction>
               <Badge variant='outline'>
               <IconBuildingLighthouse />
               Device
               </Badge>
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
               Currently Available
               <IconDeviceAirtag className='size-4' />
            </div>
            <div className='text-muted-foreground'>
               Including base, end device and extender
            </div>
         </CardFooter>
      </Card>
   )
}