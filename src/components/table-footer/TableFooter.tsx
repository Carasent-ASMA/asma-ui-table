import { type Table } from '@tanstack/react-table'
import { TablePagination } from './TablePagination'
import type { StyledTableProps } from '../../types'
import style from '../StyledTable.module.scss'

export function TableFooter<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({ table, styledTableProps }: { table: Table<TData>; styledTableProps: StyledTableProps<TData, TCustomData> }) {
    if (styledTableProps.hideFooter || styledTableProps.data.length === 0) return null

    const paginationAlignLeft = styledTableProps.paginationAlignLeft

    return (
        <div
            className={style['table-footer']}
            style={
                (paginationAlignLeft && {
                    justifyContent: 'flex-start',
                }) ||
                {}
            }
        >
            {!paginationAlignLeft && styledTableProps.footer?.(table)}
            <TablePagination
                table={table}
                showRowSelect={!!styledTableProps.showRowCountSelect}
                locale={styledTableProps.locale || 'en'}
            />
            {paginationAlignLeft && styledTableProps.footer?.(table)}
        </div>
    )
}
