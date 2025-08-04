import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : FAQ'
};

type PageProps = { params: Promise<{ section: string }> };

export default async function Page(props: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        </Suspense>
      </div>
    </PageContainer>
  );
}
