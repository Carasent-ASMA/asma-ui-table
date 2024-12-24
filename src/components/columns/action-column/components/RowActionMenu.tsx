import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import type { CellContext, Row } from '@tanstack/react-table'
import { Popover } from '@mui/material'
import { DotsVerticalIcon } from 'src/shared-components/DotsVerticalIcon'

import { StyledMenuItem } from 'src/shared-components/StyledMenuItem'
import { isCustomAction, type IAction, type ICustomAction } from 'src/types'
import React from 'react'
import { StyledButton } from 'src/shared-components/button'

export function RowActionMenu<TData>({
    tableData,
    actions,
}: {
    tableData: CellContext<TData, TData>
    actions: (row: Row<TData>) => (IAction<TData> | ICustomAction<TData>)[]
}) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()

    const allActions = actions(tableData.row)

    return (
        <div className='flex justify-center items-center w-[40px]'>
            {allActions.length ? (
                <div className='flex items-center justify-center'>
                    <StyledButton
                        dataTest=''
                        variant='text'
                        size='small'
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleOpen(e)
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
                        onClose={handleClose}
                        onClick={handleClose}
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
                                    <StyledMenuItem
                                        key={index}
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
