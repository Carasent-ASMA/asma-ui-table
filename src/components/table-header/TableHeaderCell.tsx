import { flexRender, type Header } from '@tanstack/react-table'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import style from '../StyledTable.module.scss'
import { DropUpIcon } from 'src/shared-components/DropUpIcon'
import { DropDownIcon } from 'src/shared-components/DropDownIcon'
import { ACTIONS_COLUMN_ID, INTERNAL_COLUMN_IDS, type StyledTableProps } from 'src/types'
import { getTableHeaderStyle } from 'src/helpers/getTableHeaderStyle'

export function TableHeaderCell<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({
    styledTableProps,
    header,
    tableCanResize = false,
    left,
    hasFixedLeftColumn,
    tableWidth,
}: {
    styledTableProps: StyledTableProps<TData, TCustomData>
    header: Header<TData, unknown>
    tableCanResize: boolean
    left: number
    hasFixedLeftColumn: boolean
    tableWidth: number | null
}) {
    const { hideHeader = false, enableResizing = false } = styledTableProps
    const ref = useRef<HTMLTableCellElement | null>(null)
    const [isResizing, setIsResizing] = useState(false)

    const hasActionsColumn = header.headerGroup.headers.some((hdr) => hdr.id === ACTIONS_COLUMN_ID)
    const lastColumn = header.headerGroup.headers[header.headerGroup.headers.length - (hasActionsColumn ? 2 : 1)]

    return (
        <th
            ref={ref}
            key={header.id}
            colSpan={header.colSpan}
            className={clsx(
                style['t-cell'],
                hideHeader && style['hide-header'],
                // *
                //  sticky actions
                header.column.id === 'actions' && style['t-cell__actions'],
                hasFixedLeftColumn && header.column.id === 'actions' && style['shadowed'],
                header.column.columnDef.fixedLeft === true && style['t-cell__fixed'],
            )}
            style={{
                ...getTableHeaderStyle({ enableResizing, header, element: ref.current, tableWidth }),
                ...(header.column.columnDef.fixedLeft && { left }),
            }}
        >
            <div
                className={clsx(
                    'flex items-center justify-left',
                    hideHeader ? style['hide-table-header'] : style['show-table-header'],
                    header.column.getCanSort() && style['sortable-column'],
                    header.column.columnDef.className,
                )}
                onClick={(e) => {
                    const sortingHandler = header.column.getToggleSortingHandler()
                    if (!isResizing && sortingHandler) {
                        sortingHandler(e)
                    }
                    setIsResizing(false)
                }}
            >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                    asc: <DropUpIcon className={style['sort-icon']} />,
                    desc: <DropDownIcon className={style['sort-icon']} />,
                }[header.column.getIsSorted() as string] ?? null}
                {tableCanResize &&
                    (!enableResizing ? header.id !== lastColumn?.id : true) &&
                    header.column.getCanResize() &&
                    !INTERNAL_COLUMN_IDS.includes(header.column.id) && (
                        <div
                            {...{
                                onDoubleClick: () => header.column.resetSize(),
                                onMouseDown: (e) => {
                                    e.stopPropagation()
                                    setIsResizing(true)
                                    header.getResizeHandler()(e)
                                },
                                onTouchStart: (e) => {
                                    e.stopPropagation()
                                    setIsResizing(true)
                                    header.getResizeHandler()(e)
                                },
                                className: `${style['resizer']} ${
                                    header.column.getIsResizing() ? style['isResizing'] : ''
                                }`,
                            }}
                        />
                    )}
            </div>
        </th>
    )
}
