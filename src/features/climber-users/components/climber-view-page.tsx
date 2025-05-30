import { notFound } from 'next/navigation';
import ClimberForm from './climber-form';
import { getClimberById } from '../api/get-climber-by-id';

type TDeviceViewPageProps = {
  climbId: string;
};

export default async function ClimberViewPage({
  climbId
}: TDeviceViewPageProps) {
  let climberUserData = null;
  let pageTitle = 'Add New Device';

  if (climbId !== 'new') {
    const response = await getClimberById(climbId);

    const { data } =  response ? await response.json() : {
      data: null
    };

    pageTitle = 'Update';

    climberUserData = data;

    if(!data) {
      notFound();
    }
  }

  return <ClimberForm initialData={climberUserData} pageTitle={pageTitle} />;
}
