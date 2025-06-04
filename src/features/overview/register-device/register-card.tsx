'use client';

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDatabase, IconDeviceAirtag } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";


export function RegisterCard() {
   const { data:response, isLoading } = useSWR('/api/register-device', fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
   });

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription>Device Registered</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {isLoading ? (
                  <Skeleton
                     className="w-20 h-2"
                  />
               ) : (response?.data.length)}
            </CardTitle>
            <CardAction>
               <Badge variant='outline'>
               <IconDatabase />
               Registered
               </Badge>
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
               Recently devices in used
               <IconDeviceAirtag className='size-4' />
            </div>
            <div className='text-muted-foreground'>
               Total of active climbers using tracker device 
            </div>
         </CardFooter>
      </Card>
   )
}