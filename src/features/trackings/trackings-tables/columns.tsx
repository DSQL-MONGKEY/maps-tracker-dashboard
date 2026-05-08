'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, AlertTriangle } from 'lucide-react';
import { CellAction } from './cell-action';
import { STATUS_OPTIONS } from './options';
import { Tracking } from '@/types';
import { formatDate } from '@/lib/format';

export const columns: ColumnDef<Tracking>[] = [
  // ==========================================
  // 1. IDENTITAS
  // ==========================================
  {
    id: 'device-name',
    accessorKey: 'device.name',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device Name' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.device?.name || '-'}</div>
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
      <div className='capitalize'>
        {row.original.climberUser?.name || 'Unregistered'}
      </div>
    ),
    enableColumnFilter: true
  },

  // ==========================================
  // 2. STATUS KESELAMATAN (FLAGS)
  // ==========================================
  {
    id: 'emergency-status',
    accessorKey: 'isEmergency', // Diperbarui dari is_emergency
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='SOS Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Tracking['isEmergency']>();
      const Icon = status ? AlertTriangle : CheckCircle2;

      return (
        <Badge
          variant={status ? 'destructive' : 'secondary'}
          className='whitespace-nowrap capitalize'
        >
          <Icon className='mr-1 h-3 w-3' />
          {status ? 'Emergency' : 'Safe'}
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
    id: 'fallen-status',
    accessorKey: 'isFallen',
    header: ({ column }: { column: Column<Tracking, unknown> }) => (
      <DataTableColumnHeader column={column} title='Fall Detect' />
    ),
    cell: ({ cell }) => {
      const isFallen = cell.getValue<Tracking['isFallen']>();
      return (
        <Badge
          variant={isFallen ? 'destructive' : 'outline'}
          className='whitespace-nowrap capitalize'
        >
          {isFallen ? 'Fallen' : 'Normal'}
        </Badge>
      );
    },
    enableColumnFilter: true
  },

  // ==========================================
  // 3. DATA BIOMEDIS (MAX30102)
  // ==========================================
  {
    accessorKey: 'heartRate',
    header: 'BPM',
    cell: ({ row }) => (
      <span className='font-medium'>
        {row.original.heartRate > 0 ? row.original.heartRate : '-'}
      </span>
    )
  },
  {
    accessorKey: 'spo2',
    header: 'SpO2',
    cell: ({ row }) => (
      <span className='font-medium text-blue-600 dark:text-blue-400'>
        {row.original.spo2 > 0 ? `${row.original.spo2}%` : '-'}
      </span>
    )
  },

  // ==========================================
  // 4. LINGKUNGAN (BME280)
  // ==========================================
  {
    accessorKey: 'temperature',
    header: 'Temp (°C)',
    cell: ({ row }) => (
      <span>{row.original.temperature?.toFixed(1) || '-'}</span>
    )
  },
  {
    accessorKey: 'humidity',
    header: 'Hum (%)'
  },
  {
    accessorKey: 'pressure',
    header: 'Pres (hPa)',
    cell: ({ row }) => <span>{row.original.pressure?.toFixed(1) || '-'}</span>
  },

  // ==========================================
  // 5. JARINGAN & LOKASI
  // ==========================================
  {
    accessorKey: 'latitude',
    header: 'Latitude',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.original.latitude || '-'}
      </span>
    )
  },
  {
    accessorKey: 'longitude',
    header: 'Longitude',
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.original.longitude || '-'}
      </span>
    )
  },
  {
    accessorKey: 'rssi',
    header: 'RSSI (dBm)'
  },
  {
    accessorKey: 'snr',
    header: 'SNR (dB)'
  },
  {
    id: 'routingPath',
    accessorKey: 'routingPath',
    header: 'Rute (Hops)',
    cell: ({ row }) => {
      const path = row.original.routingPath;
      const hopCount = row.original.hopCount;
      if (!path || path.length === 0) {
        return <Badge variant='outline'>Direct (0)</Badge>;
      }
      return (
        <span className='text-muted-foreground text-xs whitespace-nowrap'>
          [{path.join(' ➔ ')}] ({hopCount})
        </span>
      );
    }
  },

  // ==========================================
  // 6. WAKTU PENCATATAN
  // ==========================================
  {
    accessorKey: 'deviceTime',
    header: 'Device Time',
    cell: ({ cell }) => {
      const val = cell.getValue<Tracking['deviceTime']>();
      if (!val) return <span>-</span>;
      return (
        <span>
          {formatDate(val, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
          })}
        </span>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Server Time',
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
      return <span className='text-muted-foreground'>{formattedDate}</span>;
    }
  },

  // ==========================================
  // 7. AKSI
  // ==========================================
  {
    id: 'actions',
    header: 'More',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
