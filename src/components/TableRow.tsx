import { flexRender, type Row } from '@tanstack/react-table'
import { Fragment, useMemo, type CSSProperties, useEffect } from 'react'
import { ACTIONS_COLUMN_ID, type StyledTableProps } from '../types'
import style from './StyledTable.module.scss'
import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRootContext } from 'src/context/RootContext'

export function TableRow<TData extends { id: string | number }, TCustomData = Record<string, unknown>>({
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
        textExpandArrow,
        enableMultiRowSelection,
        enableRowSelection,
        singleSelectionRow,
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

    const { isResizing, disableResizingFlag } = useRootContext()

    useEffect(() => {
        if (defaultExpanded && row.getCanExpand() && !row.getIsExpanded()) {
            row.toggleExpand()
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

        const isIdle = !selection && !isResizing
        const hasRowClickHandler = onRowClick instanceof Function

        if (!hasRowClickHandler && textExpandArrow && isIdle) {
            row.toggleExpand()
        } else if (hasRowClickHandler && isIdle) onRowClick(e, row)

        disableResizingFlag()
    }

    const positionedCells = row.getVisibleCells().map((cell, idx, allCells) => ({
        ...cell,
        left: allCells.slice(0, idx).reduce((acc, col) => acc + (col.column.getSize() || 0), 0),
    }))

    const fixedColumns = useMemo(
        () => positionedCells.filter(({ column }) => column.columnDef.fixedLeft),
        [positionedCells],
    )

    const spaceForCheckmark = !enableMultiRowSelection && !enableRowSelection && singleSelectionRow
    const singleSelection = row.getIsSelected() && spaceForCheckmark
    const hasRowClickHandler = onRowClick instanceof Function

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
                    singleSelection && style['single-selection'],
                    getRowClassName?.(row),
                )}
                style={{
                    height: rowHeight ? `${rowHeight}px` : 'inherit',
                    ...(enableDnd && dndStyle),
                }}
                ref={disabledDnd ? undefined : setNodeRef}
                onMouseUp={onMouseUp}
                onMouseDown={(e) => {
                    if (e.detail > 1 && !hasRowClickHandler && textExpandArrow) {
                        e.preventDefault()
                    }
                }}
            >
                {positionedCells.map((cell, idx) => {
                    const isActionsCell = cell.column.id === ACTIONS_COLUMN_ID
                    const isFixed = cell.column.columnDef.fixedLeft
                    const isLastFixedCell = cell.id === fixedColumns.at(-1)?.id
                    const isExpandedRow = row.isExpanded()
                    const isFirstCell = idx === 0

                    // If first cell, always reserve space for the checkmark (even if not selected)
                    return (
                        <td
                            key={cell.id}
                            className={clsx(
                                style['t-cell'],
                                hasRowClickHandler && 'cursor-pointer',
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
                                singleSelection && style['single-selection'],
                            )}
                            style={{
                                left: isFixed ? cell.left : undefined,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    minWidth: isFirstCell ? 32 : undefined,
                                    position: 'relative',
                                }}
                            >
                                {isFirstCell && singleSelection && (
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                        }}
                                    >
                                        <Checkmark />
                                    </span>
                                )}
                                <span style={{ marginLeft: isFirstCell && spaceForCheckmark ? 30 : 0, width: '100%' }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </span>
                            </div>
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

export const Checkmark = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 2 22 22'
        style={{ color: 'var(--colors-gama-500)' }}
    >
        <path fill='currentColor' d='M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z' />
    </svg>
)
