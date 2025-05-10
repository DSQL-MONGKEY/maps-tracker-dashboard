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
    cell: ({ cell }) => (
      //@ts-ignore
      <div className="capitalize">{cell.getValue<Tracking['devices.name']>()}</div>
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
    id: 'holder-name',
    accessorKey: 'holder_name',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Holder Name' />
    ),
    cell: ({ cell }) => (
      <div className='capitalize'>
        {cell.getValue<Tracking['holder_name']>()}
      </div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'categories',
      variant: 'text',
    },
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
      label: 'categories',
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
      })
      return (
        <span>
          {formattedDate}
        </span>
      )
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
