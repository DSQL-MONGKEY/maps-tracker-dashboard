'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import { STATUS_OPTIONS } from './options';
import { Tracking } from '@/types';
import { formatDate } from '@/lib/format';

export const columns: ColumnDef<Tracking>[] = [
  {
    id: 'device-name',
    accessorKey: 'devices.name',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device Name' />
    ),
    cell: ({ row }) => (
      //@ts-ignore
      <div className="capitalize">
        {/* {cell.getValue<Tracking['devices.name']>()} */}
        {row.original.devices?.name}
      </div>
    ),
    meta: {
      label: 'Device Name',
      placeholder: 'Search Device Name...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'climber-name',
    accessorKey: 'climber_users.name',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Climber Name' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.climber_users?.name}
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    id: 'emergency-status',
    accessorKey: 'is_emergency',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Emergency Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Tracking['is_emergency']>();
      const Icon = status ? CheckCircle2 : XCircle;

      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {status.toString()}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Emergency Status',
      variant: 'multiSelect',
      options: STATUS_OPTIONS
    }
  },
  {
    accessorKey: 'latitude',
    header: 'Latitude'
  },
  {
    accessorKey: 'longitude',
    header: 'Longitude'
  },
  {
    accessorKey: 'rssi',
    header: 'RSSI'
  },
  {
    accessorKey: 'snr',
    header: 'SNR',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue<Tracking['created_at']>(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      return (
        <span>{formattedDate}</span>
      )
    }
  },

  {
    id: 'actions',
    header: 'More',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
