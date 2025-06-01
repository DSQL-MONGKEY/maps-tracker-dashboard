

export const deleteClimber = async(id: string) => {
   const response = await fetch(`/api/cimber-users/${id}`, {
      method: 'DELETE',
   });
   
   const data = await response.json();

   return data;
}