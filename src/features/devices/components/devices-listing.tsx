import { searchParamsCache } from '@/lib/searchparams';
import DevicesListingTable from './devices-listing-table';

type DevicesListingPage = {};

export default async function DevicesListingPage({}: DevicesListingPage) {
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

  return (
    <DevicesListingTable />
  );
}
