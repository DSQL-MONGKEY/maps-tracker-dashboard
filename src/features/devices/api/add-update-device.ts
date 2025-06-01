type TDeviceRequest = {
   deviceCode: string;
   name: string;
   description?: string;
   type: string;
   status: boolean;
}

export const Device = async ({ deviceCode, name, description, type, status }:TDeviceRequest, id:string, method:string) => {
   const response = await fetch(`/api/devices/${id}`, {
      method: method,
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