import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DeviceViewPage from '@/features/devices/components/devices-view-page';

export const metadata = {
  title: 'Dashboard : Device View'
};

type PageProps = { params: Promise<{ deviceId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DeviceViewPage deviceId={params.deviceId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
