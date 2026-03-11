import type { Row } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { MutableRefObject } from 'react'

export function useRowVirtualizer<TData extends { id: string | number }>({
    rows,
    rowHeight,
    scrollRef,
}: {
    rows: Row<TData>[]
    rowHeight: number
    scrollRef?: MutableRefObject<HTMLDivElement | null>
}) {
    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
        count: rows.length,
        getScrollElement: () => scrollRef?.current || null,
        estimateSize: () => rowHeight,
        measureElement:
            typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan: 10,
    })

    const virtualRows = rowVirtualizer.getVirtualItems()
    const totalSize = rowVirtualizer.getTotalSize()

    return {
        rowWindow: {
            indexes: virtualRows.map((item) => item.index),
            paddingTop: virtualRows[0]?.start ?? 0,
            paddingBottom: virtualRows.length
                ? Math.max(0, totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0))
                : 0,
        },
    }
}
