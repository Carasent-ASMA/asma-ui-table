import { useLayoutEffect, useRef } from 'react'

export function useProxyHorizontalScrollSync(enabled: boolean) {
    const tableScrollRef = useRef<HTMLDivElement | null>(null)
    const hScrollRef = useRef<HTMLDivElement | null>(null)
    const hScrollContentRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        if (!enabled) return

        const tableScrollEl = tableScrollRef.current
        const hScrollEl = hScrollRef.current
        const hScrollContentEl = hScrollContentRef.current
        if (!tableScrollEl || !hScrollEl || !hScrollContentEl) return

        let syncing = false

        const syncWidth = () => {
            hScrollContentEl.style.width = `${tableScrollEl.scrollWidth}px`
        }

        const syncProxyFromTable = () => {
            if (syncing) return
            syncing = true
            hScrollEl.scrollLeft = tableScrollEl.scrollLeft
            syncing = false
        }

        const syncTableFromProxy = () => {
            if (syncing) return
            syncing = true
            tableScrollEl.scrollLeft = hScrollEl.scrollLeft
            syncing = false
        }

        syncWidth()
        syncProxyFromTable()

        tableScrollEl.addEventListener('scroll', syncProxyFromTable, { passive: true })
        hScrollEl.addEventListener('scroll', syncTableFromProxy, { passive: true })

        const ro = new ResizeObserver(syncWidth)
        ro.observe(tableScrollEl)

        return () => {
            tableScrollEl.removeEventListener('scroll', syncProxyFromTable)
            hScrollEl.removeEventListener('scroll', syncTableFromProxy)
            ro.disconnect()
        }
    }, [enabled])

    return { tableScrollRef, hScrollRef, hScrollContentRef }
}
