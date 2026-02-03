import { type StyledTableProps, type TableState } from '../types'
import { TableBody } from './TableBody'
import { TableFooter } from './table-footer/TableFooter'
import { useStyledTable } from '../hooks/useStyledTable'
import { injectColumns } from '../helpers/injectColumns'

import style from './StyledTable.module.scss'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ColumnSizingState } from '../types'
import { TableHeader } from './table-header/TableHeader'
import { DndContext, closestCenter, type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { cn } from 'src/helpers/cn'
import { Fetching } from './Fetching'
import { RootContextProvider } from 'src/context/RootContext'
import { useIsMobileView } from 'src/hooks/useWindowWidthSize.hook'
import { useProxyHorizontalScrollSync } from './columns/helpers/useProxyHorizontalScrollSync'
import { useElementHeightPx } from './columns/helpers/useElementHeightPx'

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
export const StyledTable = <TData extends { id: string | number }, TCustomData = Record<string, unknown>>(
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

    const fetching = data.length > 0 && !!props.loading
    const showNoRowsOverlay = data.length === 0 && !props.loading

    const stickyFooter = options.stickyFooter ?? false
    const isMobileView = useIsMobileView()
    const canShowStickyFooter = !isMobileView && stickyFooter

    const enableProxyHScroll = !canShowStickyFooter
    const { tableScrollRef, hScrollRef, hScrollContentRef } = useProxyHorizontalScrollSync(enableProxyHScroll)

    const { ref: containerRef, heightPx: rowsAreaPx } = useElementHeightPx<HTMLDivElement>()

    const rowHeightPx = options.rowHeight ?? 48
    const visibleRows = table.getRowModel().rows.length

    const rowsFit = useMemo(() => {
        if (rowHeightPx <= 0) return 0
        return Math.floor(rowsAreaPx / rowHeightPx)
    }, [rowsAreaPx, rowHeightPx])

    const isShortTable = !canShowStickyFooter && visibleRows > 0 && visibleRows <= rowsFit

    const TableMarkup = (
        <table className={style['styled-table']}>
            <TableHeader
                table={table}
                styledTableProps={options}
                tableCanResize={!!options.enableColumnResizing}
                tableWidth={null}
            />
            <Fetching fetching={!!fetching} />
            <TableBody table={table} styledTableProps={options} />
        </table>
    )

    return (
        <RootContextProvider>
            <Wrapper enableDnd={!!enableDnd} data={data} setData={setData}>
                <div
                    ref={containerRef}
                    className={cn(style['asma-ui-table-styled-table'], tableClassName)}
                    style={{ height }}
                >
                    <div
                        className={cn(
                            canShowStickyFooter
                                ? style['table-wrapper']
                                : isShortTable
                                ? style['table-wrapper--proxy-bottom']
                                : style['table-wrapper--proxy'],
                            fetching && style['table-wrapper-fetching'],

                            className,
                        )}
                    >
                        {canShowStickyFooter ? (
                            <>
                                {TableMarkup}
                                {showNoRowsOverlay && (
                                    <div className={style['no-rows-overlay-container']}>{noRowsOverlay}</div>
                                )}
                            </>
                        ) : (
                            <>
                                <div ref={tableScrollRef} className={style['table-scroll']}>
                                    {TableMarkup}
                                </div>

                                <div ref={hScrollRef} className={style['table-hscroll']}>
                                    <div ref={hScrollContentRef} className={style['table-hscroll__content']} />
                                </div>
                                <div
                                    className={cn(style['table-bottom'], isShortTable && style['table-bottom--sticky'])}
                                >
                                    <TableFooter table={table} styledTableProps={options} canShowStickyFooter={false} />
                                </div>

                                {showNoRowsOverlay && (
                                    <div className={style['no-rows-overlay-container']}>{noRowsOverlay}</div>
                                )}
                            </>
                        )}
                    </div>

                    {canShowStickyFooter && (
                        <TableFooter table={table} styledTableProps={options} canShowStickyFooter />
                    )}
                </div>
            </Wrapper>
        </RootContextProvider>
    )
}
