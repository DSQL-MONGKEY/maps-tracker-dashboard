'use client';

import useSWR from "swr";
import { ClimberDataTable } from "./climber-tables";
import { columns } from "./climber-tables/columns";
import { fetcher } from "@/lib/fetcher";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { toast } from "sonner";

export default function ClimberListingTable() {
   const { data:response, error, isLoading } = useSWR('/api/climber-users', fetcher);

   if(isLoading) {
      return (
         <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
      );
   }

   const climberData = response.data ?? [];
   const totalItems = response.data.length ?? 0;

   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <ClimberDataTable
         data={climberData}
         totalItems={totalItems}
         columns={columns}
      />
   )
}