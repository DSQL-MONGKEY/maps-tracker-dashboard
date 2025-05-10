import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './trackings-tables';
import { columns } from './trackings-tables/columns';
import { Tracking } from '@/types';
import { getTrackings } from '@/features/trackings/api/getTrackings';

type TrackingListingPage = {};

export default async function TrackingListingPage({}: TrackingListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const response = await getTrackings();
  const { data } = await response?.json();
  const totalProducts = data.length;
  const trackingData: Tracking[] = data;

  return (
    <ProductTable
      data={trackingData}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
