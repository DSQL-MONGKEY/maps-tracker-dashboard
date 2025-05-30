'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { ClimberUser } from '@/types';
import { formatDate } from '@/lib/format';

export const columns: ColumnDef<ClimberUser>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<ClimberUser, unknown> }) => (
      <DataTableColumnHeader column={column} title='Device Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<ClimberUser['name']>()}</div>,
    meta: {
      label: 'Climber Name',
      placeholder: 'Search climber...',
      variant: 'text',
    },
    enableColumnFilter: true
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: ({ column }: { column: Column<ClimberUser, unknown> }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<ClimberUser['phone']>()}</div>,
    enableColumnFilter: true
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue<ClimberUser['created_at']>(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
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
