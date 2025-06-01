

type TClimber = {
   name: string;
   phone: string;
   email: string;
   address: string;
}

export const Climber = async ({ name, phone, email, address }:TClimber, id:string, method:string,  ) => {
   const response = await fetch(`/api/climber-users/${id}`, {
      method: method,
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