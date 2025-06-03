'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import {  RegisterDevices } from '@/types';
import { formatDate } from '@/lib/format';

export const columns: ColumnDef<RegisterDevices>[] = [
  {
    id: 'climber_users.name',
    accessorKey: 'climber_users.name',
    header: ({ column }: { column: Column<RegisterDevices, unknown> }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.climber_users?.name}
      </div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Username',
      placeholder: 'Search username...',
      variant: 'text',
      icon: Text
    },
  },
  {
    id: 'devices.name',
    accessorKey: 'devices.name',
    header: ({ column }: { column: Column<RegisterDevices, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.devices?.name}
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.devices?.type}
      </div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ cell }) => {
      const status = cell.getValue<RegisterDevices['is_active']>();
      const Icon = status ? CheckCircle2 : XCircle;
      
      return (
        <Badge variant={status ? 'secondary' : 'destructive'}>
          <>
            <Icon />
            {status ? 'Active' : 'Inactive'}
          </>
        </Badge>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: 'Device Usage Status',
      variant: 'multiSelect',
      options: [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ],
      icon: Text
    }
  },
  {
    id: 'registered_at',
    accessorKey: 'registered_at',
    header: 'Registered',
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue<RegisterDevices['registered_at']>() ?? undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      return (
        <span>{formattedDate}</span>
      )
    },
    enableColumnFilter: true,
  },
  {
    id: 'unregistered_at',
    accessorKey: 'unregistered_at',
    header: 'Unregistered',
    cell: ({ cell }) => {
      const unregisteredAt = cell.getValue<RegisterDevices['unregistered_at']>() ?? undefined;
      const formattedDate = formatDate(unregisteredAt, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      return (
        <span>
          {unregisteredAt == null ? '-' : formattedDate}
        </span>
      )
    },
    enableColumnFilter: true,
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: 'Last Upadated',
    cell: ({ cell }) => {
      const updatedAt = cell.getValue<RegisterDevices['updated_at']>() ?? undefined;
      const formattedDate = formatDate(updatedAt, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      return (
        <span>
          {updatedAt == null ? '-' : formattedDate}
        </span>
      )
    },
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    header: 'More',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
