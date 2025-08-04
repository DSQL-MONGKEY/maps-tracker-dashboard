/* eslint-disable no-console */
'use client';

import { useRoleStore } from "@/stores/role-store";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function InitUserRole() {
   const { isSignedIn } = useUser();
   const setRole = useRoleStore((state) => state.setRole);

   useEffect(() => {
      const loadRole = async () => {
         try {
            const res = await fetch(`/api/role`, {
               method: 'GET'
            });

            if (!res.ok) {
               throw new Error(`Failed to fetch role: ${res.status}`);
            }

            console.log('INIT');
            console.log(res);
            const { data } = await res.json();

            if(data.role) {
               setRole(data.role);
            }
            console.log(data);

         } catch(error) {
            console.error("Failed to load role", error);
         }
      }
      if (isSignedIn) {
         loadRole();
      }
   }, [isSignedIn, setRole]);
   
   return null;
}