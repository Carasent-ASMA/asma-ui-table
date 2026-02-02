import { type Table } from '@tanstack/react-table'
import { TablePagination } from './TablePagination'
import type { StyledTableProps } from '../../types'
import style from '../StyledTable.module.scss'

export function TableFooter<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({
    table,
    styledTableProps,
    canShowStickyFooter,
}: {
    table: Table<TData>
    styledTableProps: StyledTableProps<TData, TCustomData>
    canShowStickyFooter: boolean
}) {
    if (styledTableProps.hideFooter || styledTableProps.data.length === 0) return null

    const paginationAlignLeft = styledTableProps.paginationAlignLeft

    const pageSize = table.getState().pagination.pageSize
    const totalRows = table.getFilteredRowModel().rows.length
    const shouldShowPagination = totalRows > pageSize

    return (
        <div
            className={canShowStickyFooter ? style['table-footer--sticky'] : style['table-footer--inline']}
            style={
                (paginationAlignLeft && {
                    justifyContent: 'flex-start',
                }) ||
                {}
            }
        >
            {!paginationAlignLeft && styledTableProps.footer?.(table)}
            {shouldShowPagination && (
                <TablePagination
                    table={table}
                    showRowSelect={!!styledTableProps.showRowCountSelect}
                    locale={styledTableProps.locale || 'en'}
                />
            )}
            {paginationAlignLeft && styledTableProps.footer?.(table)}
        </div>
    )
}
