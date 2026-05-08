import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import FAQViewPage from '@/features/faq/FAQViewPage';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : FAQ'
};

type FAQPageProps = {
  params: Promise<{ section: string }>;
};

export default async function Page({ params }: FAQPageProps) {
  const { section } = await params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <FAQViewPage section={section} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
