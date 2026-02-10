import type { CellContext, HeaderContext } from '@tanstack/react-table'
import { SELECT_COLUMN_ID } from '../../types'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'

export function selectColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SELECT_COLUMN_ID,
        minSize: 38,
        maxSize: 38,
        size: 38,
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
                <div style={{ height: rowHeight ? rowHeight : 'auto' }} className='flex items-center w-full'>
                    <StyledCheckbox
                        size='small'
                        dataTest='cell-select'
                        checked={cell.row.getIsSelected()}
                        disabled={!cell.row.getCanSelect()}
                        onChange={() => {
                            cell.row.toggleSelected()
                        }}
                        onMouseUp={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                    />
                </div>
            )
        },
        fixedLeft: isFixed,
    }
}
