'use client';

import useSWR from 'swr';
import { TrackingDataTable } from './trackings-tables';
import { columns } from './trackings-tables/columns';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export default function TrackingsListingTable() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [search] = useQueryState('name', parseAsString.withDefault(''));
  const [categories] = useQueryState('category', parseAsString.withDefault(''));

  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));
  if (search) params.set('search', search);
  if (categories) params.set('categories', categories);

  const apiUrl = `/api/trackings?${params.toString()}`;
  const { data: response, error, isLoading } = useSWR(apiUrl, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false
  });

  // Loading state (show skeleton only on first load)
  if (isLoading && !response) {
    return (
      <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
    )
  }

  if (error) {
    toast('Error fetching data', {
      description: `details: ${error}`
    })
    return null;
  }

  const trackingData = response?.data ?? [];
  const totalItems = response?.totalCount ?? 0;

  return (
    <TrackingDataTable
      data={trackingData}
      totalItems={totalItems}
      columns={columns}
    />
  );
}