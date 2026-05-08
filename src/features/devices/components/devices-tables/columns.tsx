'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import { STATUS_OPTIONS } from './options';
import { Devices } from '@/types';
import { formatDate } from '@/lib/format';

export const columns: ColumnDef<Devices>[] = [
  {
    id: 'deviceCode',
    accessorKey: 'deviceCode',
    header: ({ column }: { column: Column<Devices, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device Code' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Devices['deviceCode']>()}</div>,
    enableColumnFilter: true
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Devices, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Devices['name']>()}</div>,
    meta: {
      label: 'Device Name',
      placeholder: 'Search Device...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Devices, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Devices['status']>();
      const Icon = status ? CheckCircle2 : XCircle;

      return (
        <Badge
          variant={status ? 'secondary' : 'destructive'}
          className='capitalize'
        >
          <Icon />
          {status ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'status',
      variant: 'multiSelect',
      options: STATUS_OPTIONS
    }
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue<Devices['createdAt']>(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      return <span>{formattedDate}</span>;
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated at',
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue<Devices['updatedAt']>(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      return <span>{formattedDate}</span>;
    }
  },

  {
    id: 'actions',
    header: 'More',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
