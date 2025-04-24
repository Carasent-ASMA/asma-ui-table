import { flexRender, type Row } from '@tanstack/react-table'
import { Fragment, useMemo, type CSSProperties, useEffect } from 'react'
import { ACTIONS_COLUMN_ID, type StyledTableProps } from '../types'
import style from './StyledTable.module.scss'
import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRootContext } from 'src/context/RootContext'

export function TableRow<
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>({
    styledTableProps,
    row,
    index,
}: {
    styledTableProps: StyledTableProps<TData, TCustomData>
    row: Row<TData>
    index: number
}) {
    const {
        focusable,
        loading,
        getRowClassName,
        rowHeight,
        onRowClick,
        expandArrow,
        enableDnd,
        disableDndForRow,
        tdClassName,
        customSubRowData,
        renderSubRows,
        defaultExpanded,
        actions,
    } = styledTableProps

    const disabledDnd = disableDndForRow?.(row)

    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
        disabled: !enableDnd || disabledDnd,
    })

    const dndStyle: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    }

    const { expandedRows, isResizing, disableResizingFlag, toggleExpand } = useRootContext()

    useEffect(() => {
        if (defaultExpanded && row.getCanExpand() && !row.getIsExpanded()) {
            toggleExpand(row.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onMouseUp = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        if (
            (e.target as HTMLDivElement).classList.contains('MuiModal-backdrop') ||
            (e.target as Node).nodeName === 'INPUT' ||
            (e.target as Node).nodeName === 'BUTTON'
        )
            return

        if (row.getCanExpand() && !expandArrow) {
            row.getToggleExpandedHandler()()
        }

        document.getElementById(row.id)?.focus()

        const selection = window.getSelection()?.type === 'Range'

        if (onRowClick && !selection && !isResizing) onRowClick(e, row)
        disableResizingFlag()
    }

    const positionedCells = row.getVisibleCells().map((cell, index, allCells) => ({
        ...cell,
        left: allCells.slice(0, index).reduce((acc, col) => acc + (col.column.getSize() || 0), 0),
    }))

    const fixedColumns = useMemo(
        () => positionedCells.filter(({ column }) => column.columnDef.fixedLeft),
        [positionedCells],
    )

    return (
        <Fragment key={row.id}>
            <tr
                data-index={index}
                data-test={row.id}
                id={row.id}
                tabIndex={focusable ? -1 : undefined}
                className={clsx(
                    style['t-row'],
                    loading && style['is-loading'],
                    row.getIsSelected() && style['selected'],
                    getRowClassName?.(row),
                )}
                style={{
                    height: rowHeight ? `${rowHeight}px` : 'inherit',
                    ...(enableDnd && dndStyle),
                }}
                ref={disabledDnd ? undefined : setNodeRef}
                onMouseUp={onMouseUp}
            >
                {positionedCells.map((cell) => {
                    const isActionsCell = cell.column.id === ACTIONS_COLUMN_ID
                    const isFixed = cell.column.columnDef.fixedLeft
                    const isLastFixedCell = cell.id === fixedColumns.at(-1)?.id
                    const isExpandedRow = expandedRows.has(row.original.id.toString())

                    return (
                        <td
                            key={cell.id}
                            className={clsx(
                                style['t-cell'],
                                tdClassName,
                                isActionsCell && style['action-cell'],
                                isActionsCell && Boolean(actions) && fixedColumns.length && style['shadowed'],
                                isActionsCell && row.getIsSelected() && style['selected'],
                                isActionsCell &&
                                    (getRowClassName?.(row)
                                        ? getRowClassName?.(row)
                                        : style['action-cell-default-background']),

                                isFixed && style['fixed-cell'],
                                isLastFixedCell && style['shadowed'],
                                isFixed && row.getIsSelected() && style['selected'],
                                isFixed &&
                                    (getRowClassName?.(row)
                                        ? getRowClassName?.(row)
                                        : style['fixed-cell-default-background']),
                                isExpandedRow && style['expanded_row'],
                            )}
                            style={{
                                left: isFixed ? cell.left : undefined,
                            }}
                        >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    )
                })}
            </tr>
            {row.getIsExpanded() && (
                <>
                    {customSubRowData &&
                        renderSubRows &&
                        renderSubRows({
                            rows: customSubRowData.get(row.original.id.toString()) ?? [],
                            row: row.original,
                        })}
                </>
            )}
        </Fragment>
    )
}
