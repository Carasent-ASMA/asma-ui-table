import {
    useReactTable,
    type Row,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'
import { SELECT_COLUMN_ID, type StyledTableProps } from '../types'
import { ExpandedRowsFeature } from 'src/custom-features/expand-rows'
import { FocusedRowsFeature } from 'src/custom-features/focus-rows/FocusRowsFeature'
import { OrderColumnsFeature } from 'src/custom-features/order-columns/OrderColumnsFeature'
import { usePersistColumnOrder } from '../custom-features/order-columns/usePersistColumnOrder'
import { usePersistedColumnOrder } from 'src/custom-features/order-columns/usePersistedColumnOrder'

export const useStyledTable = <
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>(
    props: StyledTableProps<TData, TCustomData>,
) => {
    const {
        columns,
        data,
        initialState,
        pageSize,
        enableRowSelection,
        tableInstanceRef,
        locale,
        persistColumnOrderKey,
        ...rest
    } = props

    const columnOrder = usePersistedColumnOrder(persistColumnOrderKey)

    const table = useReactTable({
        _features: [ExpandedRowsFeature, FocusedRowsFeature, OrderColumnsFeature],
        columns,
        data,
        meta: { locale: locale ?? 'en' },
        initialState: {
            pagination: { pageIndex: 0, pageSize: pageSize || 50 },
            columnVisibility: {
                ...initialState?.columnVisibility,
                [SELECT_COLUMN_ID]: false,
            },
            columnOrder,
            ...initialState,
        },
        enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId:
            rest.getRowId ||
            ((row: TData, _index: number, parent?: Row<TData>) =>
                parent ? [parent.id, row.id].join('.') : row.id.toString()),
        defaultColumn: props.enableResizing
            ? {
                  size: undefined,
                  //   maxSize: Infinity,
              }
            : undefined,
        ...rest,
    })

    if (tableInstanceRef) {
        tableInstanceRef.current = table
    }

    usePersistColumnOrder(table, persistColumnOrderKey)

    return { table }
}
