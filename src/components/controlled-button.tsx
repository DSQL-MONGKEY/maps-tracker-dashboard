'use client';

import { useRoleStore } from "@/stores/role-store";
import { ReactNode } from "react";

interface ControlledButtonProps {
   children: ReactNode
}

export default function ControlledButton({ children }: ControlledButtonProps) {
   const role = useRoleStore((state) => state.role);

   if(role !== 'admin') return null;
   
   return (
      <>
         {children}
      </>
   )
}