import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import type { CellContext, Row } from '@tanstack/react-table'
import { Popover } from '@mui/material'
import { DotsVerticalIcon } from 'src/shared-components/DotsVerticalIcon'

import { StyledMenuItem } from 'src/shared-components/StyledMenuItem'
import { isCustomAction, type IAction, type ICustomAction } from 'src/types'
import React, { useMemo } from 'react'
import { StyledButton } from 'src/shared-components/button'
import { StyledTooltip } from 'src/shared-components/tooltip'

export function RowActionMenu<TData>({
    tableData,
    actions,
}: {
    tableData: CellContext<TData, TData>
    actions: (row: Row<TData>) => (IAction<TData> | ICustomAction<TData>)[]
}) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()

    const allActions = actions(tableData.row)

    const allHidden = useMemo(() => {
        return allActions.every((a) => ('component' in a ? false : a.hide))
    }, [allActions])

    return (
        <div className='flex justify-center items-center w-[40px]'>
            {allActions.length && !allHidden ? (
                <div className='flex items-center justify-center'>
                    <StyledButton
                        dataTest=''
                        variant='text'
                        size='small'
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleOpen(e)
                            tableData.row.onChangeFocused(true)
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                        }}
                        onMouseUp={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                        }}
                    >
                        <DotsVerticalIcon className='text-delta-800' width={20} height={20} />
                    </StyledButton>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={() => {
                            handleClose()
                            tableData.row.onChangeFocused(false)
                        }}
                        onClick={() => {
                            handleClose()
                            tableData.row.onChangeFocused(false)
                        }}
                        anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'bottom',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {actions(tableData.row).map((action, index) => {
                            if (isCustomAction(action)) {
                                const CustomComponent = action.component(tableData.row, handleClose)
                                return React.isValidElement(CustomComponent) ? (
                                    <React.Fragment key={index}>{CustomComponent}</React.Fragment>
                                ) : null
                            }

                            if (!action.hide) {
                                return (
                                    <StyledTooltip
                                        key={index}
                                        title={action?.tooltipTitle}
                                        arrow
                                        placement={action?.tooltipPlacement || 'left'}
                                    >
                                        <span>
                                            <StyledMenuItem
                                                className={action.className}
                                                disabled={action.disabled}
                                                onClick={() => {
                                                    action.onClick?.(tableData.row)
                                                }}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                }}
                                                onMouseUp={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                }}
                                            >
                                                {action.label}
                                            </StyledMenuItem>
                                        </span>
                                    </StyledTooltip>
                                )
                            }

                            return null
                        })}
                    </Popover>
                </div>
            ) : null}
        </div>
    )
}
