import { type Table } from '@tanstack/react-table'
import { TableHeaderCell } from './TableHeaderCell'
import style from '../StyledTable.module.scss'
import type { StyledTableProps } from 'src/types'
import { cn } from 'src/helpers/cn'
import type { CSSProperties } from 'react'
import { useIsMobileView } from 'src/hooks/useWindowWidthSize.hook'

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
    const { stickyHeader = false, tableHeaderRef, tableHeaderStyle = {} } = styledTableProps

    const isMobileView = useIsMobileView()

    const hasFixedLeftColumn = table
        .getHeaderGroups()
        .some((group) => group.headers.some((header) => header.column.columnDef.fixedLeft === true))

    const styles: CSSProperties = stickyHeader
        ? {
              ...tableHeaderStyle,
              position: 'sticky',
              top: -0.2,
          }
        : {
              ...tableHeaderStyle,
          }

    return (
        <thead
            className={cn(style['table-header'], styledTableProps.tableHeaderClassName)}
            style={styles}
            ref={tableHeaderRef}
        >
            {table.getHeaderGroups().map((headerGroup) => {
                return (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                            const isFixed = !isMobileView &&header.column.columnDef.fixedLeft
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
