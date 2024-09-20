import type { CellContext, HeaderContext } from '@tanstack/react-table'
import { SELECT_COLUMN_ID } from '../../types'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'

export function selectColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SELECT_COLUMN_ID,
        minSize: 52,
        maxSize: 52,
        size: 52,
        header: ({ table }: HeaderContext<TData, TData>) => {
            return (
                <StyledCheckbox
                    size='small'
                    dataTest='cell-select-all'
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            )
        },
        cell: ({ cell }: CellContext<TData, TData>) => {
            return (
                <div className='w-[38px] h-[38px] flex items-center' style={{ height: rowHeight ? rowHeight : 'auto' }}>
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
        fixedLeft: isFixed,
    }
}
