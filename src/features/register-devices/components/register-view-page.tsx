import { notFound } from 'next/navigation';
import RegisterForm from './register-form';
import { getRegistereById } from '../api/get-register-by-id';

type TRegisterViewPageProps = {
  regisId: string;
};

export default async function RegisterViewPage({
  regisId
}: TRegisterViewPageProps) {
  let registerData = null;
  let method = null;
  let pageTitle = 'Register New Device';

  if (regisId !== 'new') {
    const response = await getRegistereById(regisId);

    const { data } =  response ? await response.json() : {
      data: null
    };

    registerData = data;

    if(!data) {
      notFound();
    }

    method = 'PUT';
  }

  return <RegisterForm initialData={registerData} pageTitle={pageTitle} method={method} />;
}
