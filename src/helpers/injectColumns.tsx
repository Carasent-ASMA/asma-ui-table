import { selectColumn } from '../components/columns/selectColumn'
import { generateExpandColumn } from '../components/columns/expandColumn'
import { generateActionsColumn } from '../components/columns/action-column/actionColumn'
import {
    DND_HANDLE_COLUMN_ID,
    EXPAND_COLUMN_ID,
    SELECT_COLUMN_ID,
    SHOW_FULL_TEXT_ID,
    type StyledTableProps,
} from '../types'
import { generateDndHandleColumn } from 'src/components/columns/dndHandleColumn'
import { generateShowFullTextColumn } from 'src/components/columns/showTextColumn'
import { generateEmptyColumn } from 'src/components/columns/emptyColumn'

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
        rowHeight,
        textExpandArrow,
        enableResizing,
    } = props

    const isFixed = columns.some((column) => column.fixedLeft === true)

    if (!columns.find((col) => col.id === 'actions') && (actions || customActionsNode || headerPin)) {
        columns.push(
            generateActionsColumn({
                headerPin,
                actions,
                customActionsNode,
                rowHeight,
            }),
        )
    }

    if (textExpandArrow && !columns.find((col) => col.id === SHOW_FULL_TEXT_ID)) {
        columns.unshift(generateShowFullTextColumn(isFixed, rowHeight))
    }
    if (expandArrow && !textExpandArrow && !columns.find((col) => col.id === EXPAND_COLUMN_ID)) {
        columns.unshift(generateExpandColumn(isFixed, rowHeight))
    }
    if (enableDnd && !columns.find((col) => col.id === DND_HANDLE_COLUMN_ID)) {
        columns.unshift(generateDndHandleColumn(customDndColumnProps, rowHeight))
    }
    if (enableRowSelection && !columns.find((col) => col.id === SELECT_COLUMN_ID)) {
        columns.unshift(selectColumn(isFixed, rowHeight))
    }

    /* that temporary solution fixes issue with invisible last column when we are using table with fixed columns */
    /* TODO: find better solution for this issue */
    if (isFixed && !enableResizing) {
        columns.push(generateEmptyColumn())
    }
}
