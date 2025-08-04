'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRoleStore } from '@/stores/role-store';
import { Tracking } from '@/types';
import { IconEdit, IconDotsVertical, IconTrash, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';

interface CellActionProps {
  data: Tracking;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();


  const onConfirm = async () => {
    setOpen(!open);
    const res = await fetch(`/api/trackings/${data.id}`, {
      method: 'DELETE',
    });
    const { success } = await res.json();

    if(success) {
      mutate('/api/trackings');
    }

    toast(success ? 'Deleted Successfully' : 'Failed Process', {
      description: success ? 'Record has been deleted' : 'Record not deleted'
    });

  };

  const role = useRoleStore((state) => state.role);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/trackings/view/${data.id}`)}
          >
            <IconEye className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          {role == 'admin' && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/trackings/${data.id}`)}
              >
                <IconEdit className='mr-2 h-4 w-4' /> Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <IconTrash className='mr-2 h-4 w-4' /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
