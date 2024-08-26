import { useSortable } from '@dnd-kit/sortable'
import { DotsHorizontalIcon } from 'src/shared-components/DotsHorizontalIcon'
import { DND_HANDLE_COLUMN_ID, type CellContext, type ColumnDef } from 'src/types'

export function generateDndHandleColumn<TData>(custom_props?: ColumnDef<TData, unknown>) {
    return {
        enableHiding: false,
        enableSorting: false,
        header: () => null,
        cell: ({ row }: CellContext<TData, TData>) => <RowDragHandleCell rowId={row.id} />,
        ...custom_props,
        id: DND_HANDLE_COLUMN_ID,
    }
}

export const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const { attributes, listeners } = useSortable({ id: rowId })

    return (
        <div {...attributes} {...listeners}>
            <DotsHorizontalIcon width={24} height={24} className='text-delta-800' />
        </div>
    )
}
