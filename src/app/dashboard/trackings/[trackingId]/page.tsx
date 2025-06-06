import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import TrackingViewPage from '@/features/trackings/trackings-view-page';

export const metadata = {
  title: 'Dashboard : Tracking View'
};

type PageProps = { params: Promise<{ trackingId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <TrackingViewPage trackingId={params.trackingId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
