
type TTracking = {
   deviceId: string;
   rssi?: string;
   snr?: string;
   latitude: string;
   longitude: string;
   emergencyStatus: boolean;
}

export async function addTracking({deviceId, rssi, snr, latitude, longitude, emergencyStatus}:TTracking) {
   const response = await fetch('/api/trackings', {
      method: 'POST',
      body: JSON.stringify({
         device_id: deviceId,
         rssi: rssi,
         snr: snr,
         latitude: latitude,
         longitude: longitude,
         is_emergency: emergencyStatus
      }),
   });
   const data = await response.json();

   return data;
}