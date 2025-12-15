import { ChevronDownIcon } from 'src/shared-components/ChevronDownIcon'
import { StyledButton } from 'src/shared-components/button'
import { SHOW_FULL_TEXT_ID, type CellContext } from 'src/types'

export function generateShowFullTextColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SHOW_FULL_TEXT_ID,
        minSize: 32,
        maxSize: 32,
        size: 32,
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
    const canRenderSubRows = info.row.getCanExpand()

    return (
        <div className='flex w-full items-center justify-center' style={{ height: rowHeight ? rowHeight : 'auto' }}>
            <StyledButton
                dataTest='expand-row-button'
                variant='textGray'
                size='small'
                onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onMouseUp={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onClick={() => {
                    if (canRenderSubRows) info.row.getToggleExpandedHandler()()
                    info.row.toggleExpand()
                }}
            >
                <ChevronDownIcon
                    width={20}
                    height={20}
                    style={{
                        rotate: info.row.isExpanded() ? '180deg' : '0deg',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDuration: '500ms',
                        cursor: 'pointer',
                    }}
                />
            </StyledButton>
        </div>
    )
}
