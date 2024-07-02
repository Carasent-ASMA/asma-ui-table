import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import type { CellContext, Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { Popover } from '@mui/material'
import { DotsVerticalIcon } from 'src/shared-components/DotsVerticalIcon'
import { StyledButton } from 'src/shared-components/StyledButton'
import { StyledMenuItem } from 'src/shared-components/StyledMenuItem'

export function RowActionMenu<TData>({
    tableData,
    actions,
}: {
    tableData: CellContext<TData, TData>
    actions: (row: Row<TData>) => {
        label: ReactNode
        className?: string
        disabled?: boolean
        hide?: boolean
        onClick?: (row: Row<TData>) => void
    }[]
}) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()
    const generatedActions = actions(tableData.row).filter((action) => !action.hide)
    return (
        <div className='flex justify-center items-center w-[42px]'>
            {generatedActions.length ? (
                <>
                    <StyledButton
                        variant='text'
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
                        sx={{ minWidth: '20px' }}
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
                        {actions(tableData.row)
                            .filter((action) => !action.hide)
                            .map((action, index) => (
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
                            ))}
                    </Popover>
                </>
            ) : null}
        </div>
    )
}
