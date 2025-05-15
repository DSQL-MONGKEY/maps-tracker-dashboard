
type TTracking = {
   deviceId: string;
   holderName: string;
   rssi?: string;
   snr?: string;
   latitude: number;
   longitude: number;
   emergencyStatus: boolean;
}

export async function addTracking({deviceId, holderName, latitude, longitude, emergencyStatus}:TTracking) {
   const response = await fetch('/api/trackings', {
      method: 'POST',
      body: JSON.stringify({
         device_id: deviceId,
         holder_name: holderName,
         latitude: latitude,
         longitude: longitude,
         is_emergency: emergencyStatus
      }),
   });
   const data = await response.json();

   return data;
}