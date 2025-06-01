import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import  ClimberViewPage from '@/features/climber-users/components/climber-view-page';

export const metadata = {
  title: 'Dashboard : Climber User View'
};

type PageProps = { params: Promise<{ climbId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ClimberViewPage climbId={params.climbId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
