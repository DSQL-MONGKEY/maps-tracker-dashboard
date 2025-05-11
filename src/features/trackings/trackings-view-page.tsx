import { notFound } from 'next/navigation';
import TrackingsForm from './trackings-form';
import { getTrackingById } from './api/get-tracking-by-id';

type TTrackingViewPage = {
  trackingId: string;
};

export default async function TrackingViewPage({
  trackingId
}: TTrackingViewPage) {
  let tracking = null;
  let pageTitle = 'Create New Tracking Record';

  if (trackingId !== 'new') {
    const response = await getTrackingById(String(trackingId));
    
    const { data } = response ? await response.json() : { data: null };

    tracking = data;

    if (!data) {
      notFound();
    }
    pageTitle = `Edit Tracking Record`;
  }

  return <TrackingsForm initialData={tracking} pageTitle={pageTitle} />;
}
