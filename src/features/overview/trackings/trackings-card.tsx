'use client';

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconChartHistogram, IconGps } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";


export function TrackingsCard() {
   const { data:response, isLoading } = useSWR('/api/trackings', fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
   });

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardDescription>Total Trackings Data</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {isLoading ? (
                  <Skeleton
                     className="w-20 h-2"
                  />
               ) : (response?.data.length)}
            </CardTitle>
            <CardAction>
               <Badge variant='outline'>
               <IconGps />
               Tracker
               </Badge>
            </CardAction>
         </CardHeader>
         <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
               Tracking history
               <IconChartHistogram className='size-4' />
            </div>
            <div className='text-muted-foreground'>
               Tracker for end-device/climbers in all time
            </div>
         </CardFooter>
      </Card>
   )
}