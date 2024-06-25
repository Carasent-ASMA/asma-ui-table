import type { CellContext, HeaderContext } from '@tanstack/react-table'
import { SELECT_COLUMN_ID } from '../../types'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'

export function selectColumn<TData>() {
    return {
        id: SELECT_COLUMN_ID,
        minSize: 40,
        maxSize: 40,
        size: 40,
        header: ({ table }: HeaderContext<TData, TData>) => {
            return (
                <div className='w-[25px]'>
                    <StyledCheckbox
                        size='small'
                        dataTest='cell-select-all'
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                </div>
            )
        },
        cell: ({ cell }: CellContext<TData, TData>) => {
            return (
                <div className='w-[25px]'>
                    <StyledCheckbox
                        size='small'
                        dataTest='cell-select'
                        checked={cell.row.getIsSelected()}
                        disabled={!cell.row.getCanSelect()}
                        onClick={(e) => e.stopPropagation()}
                        onChange={cell.row.getToggleSelectedHandler()}
                    />
                </div>
            )
        },
    }
}
