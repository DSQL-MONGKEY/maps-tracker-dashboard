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
import { ClimberUser } from '@/types';
import { IconEdit, IconDotsVertical, IconTrash, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteClimber } from '../../api/delete-climber';
import { mutate } from 'swr';
import { toast } from 'sonner';

interface CellActionProps {
  data: ClimberUser;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setOpen(!open);
    const response = await deleteClimber(data.id);
    const { success } = response;

    if(success) {
      mutate('/api/climber-users');
    }

    toast(success ? 'Deleted Successfully' : 'Failed Process', {
      description: success ? 'Record deleted successfully' : 'Record failed got something wrong to delete the record'
    });
};

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
            onClick={() => router.push(`/dashboard/climber-users/${data.id}`)}
          >
            <IconEye className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/climber-users/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
