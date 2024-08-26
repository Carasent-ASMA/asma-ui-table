import { selectColumn } from '../components/columns/selectColumn'
import { generateExpandColumn } from '../components/columns/expandColumn'
import { generateActionsColumn } from '../components/columns/action-column/actionColumn'
import { DND_HANDLE_COLUMN_ID, EXPAND_COLUMN_ID, SELECT_COLUMN_ID, type StyledTableProps } from '../types'
import { generateDndHandleColumn } from 'src/components/columns/dndHandleColumn'

export const injectColumns = <
    TData extends {
        id: string | number
    },
    TCustomData = Record<string, unknown>,
>(
    props: StyledTableProps<TData, TCustomData>,
) => {
    const {
        columns,
        actions,
        customActionsNode,
        headerPin = true,
        enableRowSelection,
        expandArrow,
        enableDnd,
        customDndColumnProps,
    } = props

    if (!columns.find((col) => col.id === 'actions') && (actions || customActionsNode || headerPin)) {
        columns.push(
            generateActionsColumn({
                headerPin,
                actions,
                customActionsNode,
            }),
        )
    }
    if (enableRowSelection && !columns.find((col) => col.id === SELECT_COLUMN_ID)) {
        columns.unshift(selectColumn())
    }
    if (expandArrow && !columns.find((col) => col.id === EXPAND_COLUMN_ID)) {
        columns.unshift(generateExpandColumn())
    }
    if (enableDnd && !columns.find((col) => col.id === DND_HANDLE_COLUMN_ID)) {
        columns.unshift(generateDndHandleColumn(customDndColumnProps))
    }
}
