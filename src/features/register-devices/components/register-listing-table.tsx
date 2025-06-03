'use client';

import useSWR from "swr";
import { RegisterDataTable } from "./register-tables";
import { columns } from "./register-tables/columns";
import { fetcher } from "@/lib/fetcher";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { toast } from "sonner";

export default function RegisterListingTable() {
   const { data:response, error, isLoading } = useSWR('/api/register-device', fetcher);

   if(isLoading) {
      return (
         <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
      );
   }

   const RegisterData = response?.data ?? [];
   const totalItems = response?.data.length ?? 0;

   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <RegisterDataTable
         data={RegisterData}
         totalItems={totalItems}
         columns={columns}
      />
   )
}