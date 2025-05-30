

type TClimber = {
   name: string;
   phone: string;
   email: string;
   address: string;
}

export const addClimber = async ({ name, phone, email, address }:TClimber ) => {
   const response = await fetch('/api/climber-users', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         name,
         phone,
         email,
         address,
      }),
   });
   const data = await response.json();

   return data;
}