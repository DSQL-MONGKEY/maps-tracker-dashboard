import DeviceForm from './devices-form';
import { getDeviceById } from '../api/get-devices-by-id';
import { notFound } from 'next/navigation';

type TDeviceViewPageProps = {
  deviceId: string;
};

export default async function DeviceViewPag({
  deviceId
}: TDeviceViewPageProps) {
  let device = null;
  let pageTitle = 'Add New Device';

  if (deviceId !== 'new') {
    const response = await getDeviceById(deviceId);

    const { data } =  response ? await response.json() : {
      data: null
    };

    device = data;

    if(!data) {
      notFound();
    }
  }

  return <DeviceForm initialData={device} pageTitle={pageTitle} />;
}
