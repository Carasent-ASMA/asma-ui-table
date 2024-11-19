import { ChevronDownIcon } from 'src/shared-components/ChevronDownIcon'
import { useRootContext } from 'src/context/RootContext'
import { SHOW_FULL_TEXT_ID, type CellContext } from 'src/types'

export function generateShowFullTextColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SHOW_FULL_TEXT_ID,
        minSize: 40,
        maxSize: 40,
        size: 40,
        enableHiding: false,
        enableSorting: false,
        header: () => null,
        cell: (info: CellContext<TData, TData>) => {
            return <ShowFullTextCell info={info} rowHeight={rowHeight} />
        },
        fixedLeft: isFixed,
    }
}

function ShowFullTextCell<TData>({ info, rowHeight }: { info: CellContext<TData, TData>; rowHeight?: number }) {
    const { expandedRows, toggleExpand } = useRootContext()
    const isExpanded = expandedRows.has(info.row.id)

    const canRenderSubRows = info.row.getCanExpand()

    return (
        <div
            className='flex w-full items-center justify-center'
            style={{ height: rowHeight ? rowHeight : 'auto' }}
            onClick={() => {
                if (canRenderSubRows) info.row.getToggleExpandedHandler()()
                toggleExpand(info.row.id)
            }}
            onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            onMouseUp={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <div
                style={{
                    rotate: isExpanded ? '180deg' : '0deg',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDuration: '500ms',
                }}
            >
                <ChevronDownIcon width={20} height={20} color='var(--colors-gray-700)' />
            </div>
        </div>
    )
}
