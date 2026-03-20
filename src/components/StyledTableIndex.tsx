import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'

import { cn } from 'src/helpers/cn'
import { RootContextProvider } from 'src/context/RootContext'
import { mobileView, useWindowWidthSize } from 'src/hooks/useWindowWidthSize.hook'

import type { StyledTableProps, TableState, ColumnSizingState } from '../types'
import { useStyledTable } from '../hooks/useStyledTable'
import { injectColumns } from '../helpers/injectColumns'

import { TableHeader } from './table-header/TableHeader'
import { TableBody } from './TableBody'
import { Fetching } from './Fetching'
import { TableFooter } from './table-footer/TableFooter'

import { useProxyHorizontalScrollSync } from './columns/helpers/useProxyHorizontalScrollSync'
import { useElementHeightPx } from './columns/helpers/useElementHeightPx'

import style from './StyledTable.module.scss'
import { useColumnVirtualizer } from 'src/hooks/useColumnVirtualizer'

type RowWithId = { id: string | number }

function DndProvider<TData extends RowWithId>({
    enabled,
    data,
    setData,
    children,
}: {
    enabled: boolean
    data: TData[]
    setData?: (callback: (data: TData[]) => TData[]) => void
    children: React.ReactNode
}) {
    const dataIds = useMemo<UniqueIdentifier[]>(() => data.map((d) => d.id), [data])

    const onDragEnd = (event: DragEndEvent) => {
        if (!enabled || !setData) return

        const { active, over } = event
        if (!active || !over || active.id === over.id) return

        setData((prev) => {
            const oldIndex = dataIds.indexOf(active.id)
            const newIndex = dataIds.indexOf(over.id)
            return arrayMove(prev, oldIndex, newIndex)
        })
    }

    if (!enabled) return <>{children}</>

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={onDragEnd}
        >
            {children}
        </DndContext>
    )
}

function OverlayShell({
    enabled,
    className,
    children,
}: {
    enabled: boolean
    className?: string
    children: React.ReactNode
}) {
    if (!enabled) return <>{children}</>
    return <div className={className}>{children}</div>
}

export const StyledTable = <TData extends RowWithId, TCustomData = Record<string, unknown>>(
    props: StyledTableProps<TData, TCustomData> & {
        getColumnSizing?: (column_sizing: ColumnSizingState) => void
        getTableState?: (tableState: TableState) => void
        setData?: (callback: (data: TData[]) => TData[]) => void
    },
) => {
    const options = useMemo(() => ({ ...props, rowHeight: props.rowHeight || 48 }), [props])

    const { className, tableClassName, height, noRowsOverlay, data, enableDnd, setData, loading } = options

    injectColumns(options)
    const { table } = useStyledTable(options)

    const hasRows = data.length > 0
    const fetching = hasRows && !!loading
    const showNoRowsOverlay = !hasRows && !loading

    const windowWidth = useWindowWidthSize()
    const isMobileView = mobileView(windowWidth)
    const wantsStickyFooter = !!options.stickyFooter

    const canShowStickyFooter = wantsStickyFooter && !isMobileView
    const [hasInternalOverflow, setHasInternalOverflow] = useState(false)
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    const enableProxyHScroll = !canShowStickyFooter
    const { tableScrollRef, tableXRef, hScrollRef, hScrollContentRef } =
        useProxyHorizontalScrollSync(enableProxyHScroll)

    // biome-ignore lint/correctness/useExhaustiveDependencies: <needed for overflow identification>
    useLayoutEffect(() => {
        const host = canShowStickyFooter ? wrapperRef.current : tableXRef.current ?? tableScrollRef.current

        if (!host) {
            setHasInternalOverflow(false)
            return
        }

        setHasInternalOverflow(host.scrollWidth > host.clientWidth)
    }, [canShowStickyFooter, tableXRef, tableScrollRef, windowWidth])

    const { ref: containerRef, heightPx: rowsAreaPx } = useElementHeightPx<HTMLDivElement>()

    const rowHeightPx = options.rowHeight ?? 48
    const visibleRows = table.getRowModel().rows.length

    const rowsFit = useMemo(() => {
        if (rowHeightPx <= 0) return 0
        return Math.floor(rowsAreaPx / rowHeightPx)
    }, [rowsAreaPx, rowHeightPx])

    const isShortTable = !canShowStickyFooter && visibleRows > 0 && visibleRows <= rowsFit
    const shouldExpandEmptyBody = !canShowStickyFooter && showNoRowsOverlay

    const tableWrapperClass = cn(
        canShowStickyFooter
            ? style['table-wrapper']
            : isShortTable || shouldExpandEmptyBody
            ? style['table-wrapper--proxy-bottom']
            : style['table-wrapper--proxy'],
        fetching && style['table-wrapper-fetching'],
        showNoRowsOverlay && style['table-wrapper--no-rows'],
        className,
    )
    const scrollRef = canShowStickyFooter ? wrapperRef : tableScrollRef

    const { columnWindow } = useColumnVirtualizer({ table, scrollRef, isMobileView })

    const TableMarkup = (
        <table className={style['styled-table']} style={{ width: table.getTotalSize(), minWidth: '100%' }}>
            <TableHeader
                table={table}
                styledTableProps={options}
                tableCanResize={!!options.enableColumnResizing}
                tableWidth={null}
                columnWindow={columnWindow}
            />
            <Fetching fetching={!!fetching} />
            <TableBody table={table} styledTableProps={options} columnWindow={columnWindow} />
        </table>
    )

    const NoRowsOverlay = showNoRowsOverlay ? (
        <div className={style['no-rows-overlay-container']}>
            <div className={style['no-rows-overlay-content']}>{noRowsOverlay}</div>
        </div>
    ) : null

    return (
        <RootContextProvider>
            <DndProvider enabled={!!enableDnd} data={data} setData={setData}>
                <div
                    ref={containerRef}
                    className={cn(style['asma-ui-table-styled-table'], tableClassName)}
                    data-x-overflow={hasInternalOverflow ? 'true' : 'false'}
                    style={{ height }}
                >
                    <OverlayShell enabled={canShowStickyFooter} className={style['table-shell']}>
                        <div ref={wrapperRef} className={tableWrapperClass}>
                            {canShowStickyFooter ? (
                                <>
                                    {TableMarkup}
                                    {NoRowsOverlay}
                                </>
                            ) : (
                                <div ref={tableScrollRef} className={cn(style['table-scroll'])}>
                                    <div
                                        ref={tableXRef}
                                        className={cn(style['table-x'], !isShortTable && style['table-x--fill-height'])}
                                    >
                                        {TableMarkup}
                                    </div>

                                    {NoRowsOverlay}

                                    <div ref={hScrollRef} className={style['table-hscroll']}>
                                        <div ref={hScrollContentRef} className={style['table-hscroll__content']} />
                                    </div>

                                    <div
                                        className={cn(
                                            style['table-bottom'],
                                            isShortTable && style['table-bottom--sticky'],
                                        )}
                                    >
                                        <TableFooter
                                            table={table}
                                            styledTableProps={options}
                                            canShowStickyFooter={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </OverlayShell>

                    {canShowStickyFooter && (
                        <TableFooter table={table} styledTableProps={options} canShowStickyFooter />
                    )}
                </div>
            </DndProvider>
        </RootContextProvider>
    )
}
