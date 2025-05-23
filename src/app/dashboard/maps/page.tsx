import ClientMapWrapper from '@/features/maps/components/client-map-wrapper';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import DistanceFormSelector from '@/features/maps/components/distance-form-selector';

export const metadata = {
  title: 'Dashboard: Maps'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MapsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Maps'
            description='Interactive map to track devices in real-time'
          />
          <Link
            href='/dashboard/maps/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
          <Suspense>
            <div className='w-full p-2 flex justify-center overflow-hidden'>
              <div className='w-full   h-full z-0'>
                <ClientMapWrapper />
              </div>
            </div>
            <DistanceFormSelector />
          </Suspense>
      </div>
    </PageContainer>
  );
}

