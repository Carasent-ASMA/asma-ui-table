import { type Table } from '@tanstack/react-table'
import type { StyledTableProps } from '../types'
import { TableSkeleton } from './TableSkeleton'
import { TableRows } from './TableRows'
import { TableNoRowsOverlay } from './TableNoRowsOverlay'
import style from './StyledTable.module.scss'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export function TableBody<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({ table, styledTableProps }: { table: Table<TData>; styledTableProps: StyledTableProps<TData, TCustomData> }) {
    const { columns, data, loading, noRowsOverlay, enableDnd } = styledTableProps

    return (
        <tbody className={style['tbody']}>
            {data.length === 0 && loading ? (
                <TableSkeleton colSpan={columns.length} />
            ) : data.length > 0 ? (
                <>
                    {enableDnd ? (
                        <SortableContext items={data} strategy={verticalListSortingStrategy}>
                            <TableRows table={table} styledTableProps={styledTableProps} />
                        </SortableContext>
                    ) : (
                        <TableRows table={table} styledTableProps={styledTableProps} />
                    )}
                </>
            ) : (
                <TableNoRowsOverlay colSpan={columns.length} noRowsOverlay={noRowsOverlay} />
            )}
        </tbody>
    )
}
