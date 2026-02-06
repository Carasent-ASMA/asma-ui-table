import { Popover } from '@mui/material'
import type { HeaderContext } from '@tanstack/react-table'
import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import { PinIcon } from 'src/shared-components/PinIcon'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'
import { StyledMenuItem } from 'src/shared-components/StyledMenuItem'
import { INTERNAL_COLUMN_IDS } from 'src/types'
import { CSS } from '@dnd-kit/utilities'

import styles from './TableActions.module.scss'
import { DndContext, useSensors, type DragEndEvent, MouseSensor, useSensor } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DotsHorizontalIcon } from 'src/shared-components/DotsHorizontalIcon'
import { cn } from 'src/helpers/cn'
import { StyledTooltip } from 'src/shared-components/tooltip'
import { useTranslations } from 'src/hooks/useTranslations'

function SortableColumnItem({ id, disabled, children }: { id: string; disabled: boolean; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}

export function HeaderActionMenu<TData>({
    headerData,
    locale,
}: {
    headerData: HeaderContext<TData, TData>
    locale?: 'en' | 'no'
}) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()

    const isAnyColumnHidden = headerData.table
        .getAllLeafColumns()
        .some((col) => col.getCanHide() && !col.getIsVisible() && !INTERNAL_COLUMN_IDS.includes(col.id))

    const items = headerData.table.getAllLeafColumns()

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!active || !over || active.id === over.id) return

        const overColumnFixed = !!items.find((i) => i.id === over.id)?.columnDef.fixedLeft

        if (overColumnFixed) return
        headerData.table.resetColumnOrder()

        headerData.table.setColumnOrder((columnOrder) => {
            const oldIndex = columnOrder.indexOf(active.id as string)
            const newIndex = columnOrder.indexOf(over.id as string)
            return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
        })
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    )

    const t = useTranslations(locale)

    const filteredList = items.filter((c) => !INTERNAL_COLUMN_IDS.includes(c.id) && !!c.columnDef.header)

    return (
        <div className='flex absolute-center items-center justify-end w-full'>
            <button type='button' className={styles['actions-header']} onClick={handleOpen}>
                <PinIcon className={styles['pin-icon']} />
                {isAnyColumnHidden && <div className={styles['pin-indicator']}></div>}
            </button>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom',
                }}
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        maxHeight: 'calc(7 * 44px)',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                    },
                }}
            >
                <DndContext
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext items={filteredList.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        {filteredList.map((column) => {
                            const dragDisabled = !!column.columnDef.fixedLeft
                            const hidingDisabled = column.columnDef.enableHiding === false

                            return (
                                <SortableColumnItem key={column.id} id={column.id} disabled={dragDisabled}>
                                    <StyledTooltip title={dragDisabled && t.column_reorder} arrow>
                                        <span>
                                            <StyledMenuItem
                                                onClick={() => {
                                                    if (hidingDisabled) return
                                                    column.toggleVisibility(!column.getIsVisible())
                                                }}
                                                className='h-[44px] flex items-center'
                                            >
                                                <DotsHorizontalIcon
                                                    width={20}
                                                    height={20}
                                                    className={cn(
                                                        dragDisabled
                                                            ? 'text-delta-300 cursor-not-allowed'
                                                            : 'text-delta-800 cursor-grab',
                                                    )}
                                                />
                                                <StyledTooltip title={hidingDisabled && t.column_hidden} arrow>
                                                    <span className='px-2'>
                                                        <StyledCheckbox
                                                            readOnly={hidingDisabled}
                                                            dataTest={`${column.id}-column-visibility-checkbox`}
                                                            size='small'
                                                            disableRipple
                                                            checked={column.getIsVisible()}
                                                            hideWrapper
                                                        />
                                                    </span>
                                                </StyledTooltip>
                                                {column.columnDef.pinnedHeaderText ??
                                                    (typeof column.columnDef.header === 'string'
                                                        ? column.columnDef.header
                                                        : column.id)}
                                            </StyledMenuItem>
                                        </span>
                                    </StyledTooltip>
                                </SortableColumnItem>
                            )
                        })}
                    </SortableContext>
                </DndContext>
            </Popover>
        </div>
    )
}
