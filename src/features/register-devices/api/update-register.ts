type TDeviceRequest = {
   deviceCode: string;
   name: string;
   description?: string;
   type: string;
   status: boolean;
}

export const updateDevice = async ({ deviceCode, name, description, type, status }: TDeviceRequest) => {
   const response = await fetch('/api/devices', {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         device_code: deviceCode,
         name,
         description,
         type,
         status
      }),
   });
   const data = await response.json();

   return data;
}