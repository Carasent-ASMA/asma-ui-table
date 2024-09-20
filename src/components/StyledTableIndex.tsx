import { type StyledTableProps, type TableState } from '../types'
import { TableBody } from './TableBody'
import { TableFooter } from './table-footer/TableFooter'
import { useStyledTable } from '../hooks/useStyledTable'
import { injectColumns } from '../helpers/injectColumns'

import style from './StyledTable.module.scss'
import clsx from 'clsx'
import { memo, useMemo } from 'react'
import type { ColumnSizingState } from '../types'
import { TableHeader } from './table-header/TableHeader'
import { DndContext, closestCenter, type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { ShowFullTextProvider } from './columns/showTextColumn'

const DndContextCustom = <TData extends { id: string | number }>({
    data,
    setData,
    children,
}: {
    data: TData[]
    setData?: (callback: (data: TData[]) => TData[]) => void
    children: JSX.Element
}) => {
    const dataIds = useMemo<UniqueIdentifier[]>(() => data?.map((d) => d.id), [data])

    function handleDragEnd(event: DragEndEvent) {
        if (!setData) return

        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)

                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            {children}
        </DndContext>
    )
}

const Wrapper = <TData extends { id: string | number }>({
    data,
    setData,
    enableDnd,
    children,
}: {
    data: TData[]
    enableDnd: boolean
    setData?: (callback: (data: TData[]) => TData[]) => void
    children: JSX.Element
}) => {
    return enableDnd ? (
        <DndContextCustom data={data} setData={setData}>
            {children}
        </DndContextCustom>
    ) : (
        <>{children}</>
    )
}

/**
 *
 * Custom props:
 * @param size: Column sizing. use NaN (width 100%) -  only one time for the main column. It will make the column very responsive.. Example is in Storybook.
 *
 *  @param focusable: Used for controlling the focus of rows. If set to true, the tabIndex={0} attribute will be added to each table row. Used, for example, when adding a new item to scroll to it and focus it
 *
 * @param setData: This is used to re-order the data after dragging with dnd use it with enableDnd
 */
export const StyledTable = <
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>(
    props: StyledTableProps<TData, TCustomData> & {
        getColumnSizing?: (column_sizing: ColumnSizingState) => void
        getTableState?: (tableState: TableState) => void
        setData?: (callback: (data: TData[]) => TData[]) => void
    },
) => {
    const options = { ...props, rowHeight: props.rowHeight || 48 }
    const { className, height, data, enableDnd, setData } = options

    injectColumns(options)
    const { table } = useStyledTable(options)

    const columnSizeVars = useMemo(() => {
        if (!options.enableColumnResizing) return

        const headers = table.getFlatHeaders()
        const colSizes: { [key: string]: number } = {}
        for (let i = 0; i < headers.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const header = headers[i]!
            colSizes[`--header-${header.id}-size`] = header.getSize()
            colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
        }
        options.getTableState?.(table.getState())
        options.getColumnSizing?.(table.getState().columnSizing)
        return colSizes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.enableColumnResizing, table.getState().columnSizingInfo, table.getState().columnSizing])

    return (
        <ShowFullTextProvider>
        <Wrapper enableDnd={!!enableDnd} data={data} setData={setData}>
            <div className={style['asma-ui-table-styled-table']}>
                <div className={clsx(style['table-wrapper'], className)} style={{ height }}>
                    <table
                        className={style['styled-table']}
                        style={{
                            ...columnSizeVars,
                            //width: table.getTotalSize(),
                        }}
                    >
                        <TableHeader
                            table={table}
                            styledTableProps={options}
                            tableCanResize={!!options.enableColumnResizing}
                        />
                        {columnSizeVars ? (
                            <>
                                {table.getState().columnSizingInfo.isResizingColumn ? (
                                    <MemoizedTableBody table={table} styledTableProps={options} />
                                ) : (
                                    <TableBody table={table} styledTableProps={options} />
                                )}
                            </>
                        ) : (
                            <TableBody table={table} styledTableProps={options} />
                        )}
                    </table>
                </div>
                <TableFooter table={table} styledTableProps={options} />
            </div>
        </Wrapper>
        </ShowFullTextProvider>
    )
}

export const MemoizedTableBody = memo(
    TableBody,
    (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody
