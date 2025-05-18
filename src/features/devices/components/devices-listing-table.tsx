'use client';

import useSWR from "swr";
import { DevicesDataTable } from "./devices-tables";
import { columns } from "./devices-tables/columns";
import { fetcher } from "@/lib/fetcher";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { toast } from "sonner";

export default function DevicesListingTable() {
   const { data:response, error, isLoading } = useSWR('/api/devices', fetcher);

   if(isLoading) {
      return (
         <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
      );
   }

   const DevicesData = response.data ?? [];
   const totalItems = response.data.length ?? 0;

   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <DevicesDataTable
         data={DevicesData}
         totalItems={totalItems}
         columns={columns}
      />
   )
}