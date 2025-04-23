import { useSortable } from '@dnd-kit/sortable'
import type { Arguments } from '@dnd-kit/sortable/dist/hooks/useSortable'
import type { FC } from 'react'
import { DotsHorizontalIcon } from 'src/shared-components/DotsHorizontalIcon'
import { DND_HANDLE_COLUMN_ID, type CellContext, type ColumnDef } from 'src/types'

export function generateDndHandleColumn<TData>(custom_props?: ColumnDef<TData, unknown>, rowHeight?: number) {
    return {
        enableHiding: false,
        enableSorting: false,
        header: () => null,
        cell: ({ row }: CellContext<TData, TData>) => <RowDragHandleCell rowId={row.id} rowHeight={rowHeight} />,
        ...custom_props,
        id: DND_HANDLE_COLUMN_ID,
    }
}

export const RowDragHandleCell: FC<
    Partial<Omit<Arguments, 'id'>> & {
        rowId: string
        rowHeight?: number
    }
> = ({ rowId, rowHeight, ...rest }) => {
    const { attributes, listeners } = useSortable({ id: rowId, ...rest })

    return (
        <div
            {...attributes}
            {...listeners}
            style={{
                height: rowHeight ? rowHeight : 'auto',
            }}
        >
            <DotsHorizontalIcon width={24} height={24} className='text-delta-800' />
        </div>
    )
}
