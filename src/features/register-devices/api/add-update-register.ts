type TDeviceRequest = {
   climberUserId: string;
   deviceId: string;
   registeredAt?: string | null;
   unregisteredAt?: string | null;
   isActive: boolean;
}

export const RegisterDevice = async ({ climberUserId, deviceId, registeredAt, unregisteredAt, isActive, }:TDeviceRequest, id:string, method:string) => {


   const response = await fetch(`/api/register-device/${id}`, {
      method: method,
      body: JSON.stringify({
         climberUserId,
         deviceId,
         registeredAt,
         unregisteredAt,
         isActive
      }),
   });

   const data = await response.json();
   
   return data;
}