import type { Table } from '@tanstack/react-table'
import type { StyledTableProps } from '../types'
import { TableRow } from './TableRow'
import type { MutableRefObject } from 'react'
import type { ColumnWindow } from 'src/hooks/useColumnVirtualizer'
import { useRowVirtualizer } from 'src/hooks/useRowVirtualizer'

export function TableRows<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({
    styledTableProps,
    table,
    scrollRef,
    columnWindow,
}: {
    styledTableProps: StyledTableProps<TData, TCustomData>
    table: Table<TData>
    scrollRef?: MutableRefObject<HTMLDivElement | null>
    columnWindow: ColumnWindow
}) {
    const rows = styledTableProps.hideFooter ? table.getExpandedRowModel().rows : table.getRowModel().rows
    const rowHeight = styledTableProps.rowHeight || 48

    const {
        rowWindow: { indexes, paddingBottom, paddingTop },
    } = useRowVirtualizer({
        rows,
        rowHeight,
        scrollRef,
    })

    return (
        <>
            {paddingTop > 0 && <tr style={{ height: `${paddingTop}px` }} />}
            {indexes.map((index) => {
                const row = rows[index]

                if (!row) return null
                return (
                    <TableRow
                        key={row.id}
                        styledTableProps={styledTableProps}
                        row={row}
                        index={index}
                        columnWindow={columnWindow}
                    />
                )
            })}
            {paddingBottom > 0 && <tr style={{ height: `${paddingBottom}px` }} />}
        </>
    )
}
