import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import RegisterViewPage from '@/features/register-devices/components/register-view-page';

export const metadata = {
  title: 'Dashboard : Device View'
};

type PageProps = { params: Promise<{ regisId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <RegisterViewPage regisId={params.regisId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
