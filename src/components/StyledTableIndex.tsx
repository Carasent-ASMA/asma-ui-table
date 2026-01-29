import { type StyledTableProps, type TableState } from '../types'
import { TableBody } from './TableBody'
import { TableFooter } from './table-footer/TableFooter'
import { useStyledTable } from '../hooks/useStyledTable'
import { injectColumns } from '../helpers/injectColumns'

import style from './StyledTable.module.scss'
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ColumnSizingState } from '../types'
import { TableHeader } from './table-header/TableHeader'
import { DndContext, closestCenter, type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { cn } from 'src/helpers/cn'
import { Fetching } from './Fetching'
import { RootContextProvider } from 'src/context/RootContext'

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
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
        >
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
    const { className, tableClassName, height, noRowsOverlay, data, enableDnd, setData } = options

    injectColumns(options)
    const { table } = useStyledTable(options)

    const tableRef = useRef<HTMLTableElement | null>(null)
    const [tableWidth, setTableWidth] = useState<number | null>(null)

    useLayoutEffect(() => {
        const tableElement = tableRef.current
        if (!tableElement) return

        const updateWidth = (type: 'setup' | 'resize') => {
            const width = tableElement.getBoundingClientRect().width
            setTableWidth((prevWidth) => {
                if (type === 'setup' || width !== prevWidth) {
                    return width
                }
                return prevWidth
            })
        }

        const resizeObserver = new ResizeObserver(() => updateWidth('resize'))
        resizeObserver.observe(tableElement)

        updateWidth('setup')

        return () => {
            resizeObserver.unobserve(tableElement)
        }
    }, [])

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

    const fetching = !!(data.length > 0) && props.loading
    const showNoRowsOverlay = data.length === 0 && !props.loading

    return (
        <RootContextProvider>
            <Wrapper enableDnd={!!enableDnd} data={data} setData={setData}>
                <div className={cn(style['asma-ui-table-styled-table'], tableClassName)} style={{ height }}>
                    <div className={cn(style['table-wrapper'], fetching && style['table-wrapper-fetching'], className)}>
                        <table
                            ref={tableRef}
                            className={style['styled-table']}
                            style={{
                                ...columnSizeVars,
                            }}
                        >
                            <TableHeader
                                table={table}
                                styledTableProps={options}
                                tableCanResize={!!options.enableColumnResizing}
                                tableWidth={tableWidth}
                            />
                            <Fetching fetching={!!fetching} />

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

                        {showNoRowsOverlay && (
                            <div className={style['no-rows-overlay-container']}>
                                {noRowsOverlay}
                            </div>
                        )}
                    </div>
                    <TableFooter table={table} styledTableProps={options} />
                </div>
            </Wrapper>
        </RootContextProvider>
    )
}

export const MemoizedTableBody = memo(
    TableBody,
    (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody
