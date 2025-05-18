'use client';

import useSWR from "swr";
import { TrackingDataTable } from "./trackings-tables";
import { columns } from "./trackings-tables/columns";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TrackingsListingTable({ filter }: any) {
   const { data:response, error, isLoading } = useSWR('/api/trackings', fetcher);

   if(isLoading) return (
      <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
   )

   const trackingData = response.data ?? [];
   const totalItems = response.data.length ?? 0;

   
   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <TrackingDataTable
         data={trackingData}
         totalItems={totalItems}
         columns={columns}
      />
   );
}