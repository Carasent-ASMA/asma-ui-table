import { type CellContext, type HeaderContext, type Row } from '@tanstack/react-table'
import { RowActionMenu } from './components/RowActionMenu'
import { HeaderActionMenu } from './components/HeaderActionMenu'
import type { ReactNode } from 'react'
import type { IAction, ICustomAction } from 'src/types'

export function generateActionsColumn<TData>(options: {
    headerPin: boolean
    actions?: (row: Row<TData>) => (IAction<TData> | ICustomAction<TData>)[]
    customActionsNode?: (row: CellContext<TData, TData>) => ReactNode
    rowHeight?: number
}) {
    const { headerPin, actions, customActionsNode, rowHeight } = options

    return {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        accessorFn: (row: TData) => {
            return row
        },
        header: (props: HeaderContext<TData, TData>) => {
            return headerPin ? <HeaderActionMenu headerData={props} /> : null
        },
        cell: (cell: CellContext<TData, TData>) =>
            actions || customActionsNode ? (
                <div 
                    className='flex items-center justify-center'
                    style={{ height: rowHeight ? rowHeight : 'auto' }}
                >
                    {customActionsNode && <div className='mr-1'>{customActionsNode?.(cell)}</div>}
                    {actions && <RowActionMenu tableData={cell} actions={actions} />}
                </div>
            ) : null,
        size: 50,
    }
}
