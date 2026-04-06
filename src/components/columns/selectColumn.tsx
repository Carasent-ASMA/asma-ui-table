import type { CellContext, HeaderContext } from '@tanstack/react-table'
import { SELECT_COLUMN_ID } from '../../types'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'
import { StyledTooltip } from 'src/shared-components/tooltip'
import { cn } from 'src/helpers/cn'

export function selectColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SELECT_COLUMN_ID,
        minSize: 38,
        maxSize: 38,
        size: 38,
        header: ({ table }: HeaderContext<TData, TData>) => {
            return (
                <button
                    type='button'
                    className='pl-2 flex size-full items-center justify-start'
                    onClick={() => table.toggleAllRowsSelected()}
                >
                    <StyledCheckbox
                        size='small'
                        dataTest='cell-select-all'
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        // DO NOT REMOVE needed for layout consistency
                        hideWrapper
                    />
                </button>
            )
        },
        cell: ({ cell }: CellContext<TData, TData>) => {
            const disabled = !cell.row.getCanSelect()
            return (
                <button
                    type='button'
                    style={{ height: rowHeight ? rowHeight : 'auto' }}
                    className='pl-2 flex w-full items-center justify-start m-0 p-0'
                    disabled={disabled}
                    onClick={() => cell.row.toggleSelected()}
                >
                    <StyledTooltip arrow title={cell.row.getRowSelectionTooltip()}>
                        <span className={disabled ? 'cursor-not-allowed' : ''}>
                            <StyledCheckbox
                                size='small'
                                dataTest='cell-select'
                                checked={cell.row.getIsSelected()}
                                // DO NOT REMOVE needed for layout consistency
                                hideWrapper
                                disabled={disabled}
                                onMouseUp={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                            />
                        </span>
                    </StyledTooltip>
                </button>
            )
        },
        fixedLeft: isFixed,
    }
}
