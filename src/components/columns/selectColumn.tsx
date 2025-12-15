import type { CellContext, HeaderContext } from '@tanstack/react-table'
import { SELECT_COLUMN_ID } from '../../types'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'

export function selectColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SELECT_COLUMN_ID,
        minSize: 32,
        maxSize: 32,
        size: 32,
        header: ({ table }: HeaderContext<TData, TData>) => {
            return (
                <StyledCheckbox
                    size='small'
                    dataTest='cell-select-all'
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    classes={{ root: 'w-6 h-6' }}
                />
            )
        },
        cell: ({ cell }: CellContext<TData, TData>) => {
            return (
                <div style={{ height: rowHeight ? rowHeight : 'auto' }} className='flex items-center'>
                    <StyledCheckbox
                        size='small'
                        dataTest='cell-select'
                        checked={cell.row.getIsSelected()}
                        disabled={!cell.row.getCanSelect()}
                        onClick={(e) => e.stopPropagation()}
                        onChange={cell.row.getToggleSelectedHandler()}
                        classes={{ root: 'w-6 h-6' }}
                    />
                </div>
            )
        },
        fixedLeft: isFixed,
    }
}
