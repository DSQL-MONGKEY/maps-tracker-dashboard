export async function getDevices() {
   const response = await fetch('/api/devices', {
      method: 'GET'
   });
   const data = await response.json();

   return data;
}