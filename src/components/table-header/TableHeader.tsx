import { type Table } from '@tanstack/react-table'
import clsx from 'clsx'
import { TableHeaderCell } from './TableHeaderCell'
import style from '../StyledTable.module.scss'
import type { StyledTableProps } from 'src/types'

export function TableHeader<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({
    table,
    styledTableProps,
    tableCanResize,
    tableWidth,
}: {
    table: Table<TData>
    styledTableProps: StyledTableProps<TData, TCustomData>
    tableCanResize: boolean
    tableWidth: number | null
}) {
    const { stickyHeader = false, hideHeader = false } = styledTableProps

    const hasFixedLeftColumn = table
        .getHeaderGroups()
        .some((group) => group.headers.some((header) => header.column.columnDef.fixedLeft === true))

    return (
        <thead
            className={clsx(style['table-header'], hideHeader && style['hide-table-header'])}
            style={
                (stickyHeader && {
                    position: 'sticky',
                    top: -0.2,
                }) ||
                {}
            }
        >
            {table.getHeaderGroups().map((headerGroup) => {
                return (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                            const isFixed = header.column.columnDef.fixedLeft
                            const left = headerGroup.headers
                                .slice(0, index)
                                .reduce((acc, col) => acc + (col.column.getSize() || 0), 0)

                            return (
                                <TableHeaderCell
                                    key={header.column.id}
                                    styledTableProps={styledTableProps}
                                    header={header}
                                    tableCanResize={tableCanResize}
                                    left={isFixed ? left : 0}
                                    hasFixedLeftColumn={hasFixedLeftColumn}
                                    tableWidth={tableWidth}
                                />
                            )
                        })}
                    </tr>
                )
            })}
        </thead>
    )
}
