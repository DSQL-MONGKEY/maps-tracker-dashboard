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
    accessorKey: 'device.name',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device Name' />
    ),
    cell: ({ row }) => (
      //@ts-ignore
      <div className='capitalize'>{row.original.device?.name}</div>
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
    accessorKey: 'climberUser.name',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Climber Name' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.climberUser?.name}</div>
    ),
    enableColumnFilter: true
  },
  {
    id: 'emergency-status',
    accessorKey: 'is_emergency',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Emergency Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Tracking['isEmergency']>();
      const Icon = status ? XCircle : CheckCircle2;

      return (
        <Badge
          variant={status ? 'destructive' : 'secondary'}
          className='capitalize'
        >
          <Icon />
          {status ? 'Emergency' : 'Normal'}
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
    header: 'SNR'
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ cell }) => {
      const formattedDate = formatDate(
        cell.getValue<Tracking['created_at']>(),
        {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        }
      );
      return <span>{formattedDate}</span>;
    }
  },

  {
    id: 'actions',
    header: 'More',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
