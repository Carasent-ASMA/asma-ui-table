import { Popover } from '@mui/material'
import type { HeaderContext } from '@tanstack/react-table'
import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import { PinIcon } from 'src/shared-components/PinIcon'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'
import { StyledMenuItem } from 'src/shared-components/StyledMenuItem'
import { SELECT_COLUMN_ID } from 'src/types'

export function HeaderActionMenu<TData>({ headerData }: { headerData: HeaderContext<TData, TData> }) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()
    return (
        <div className='flex absolute-center items-center justify-center '>
            <div className='h-[30px] flex items-center justify-center cursor-pointer' onClick={handleOpen}>
                <PinIcon className='text-delta-500 hover:text-delta-600 min-w-[20px] min-h-[20px]' />
            </div>
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
                {headerData.table
                    .getAllLeafColumns()
                    .filter((col) => col.getCanHide() && col.id !== SELECT_COLUMN_ID)
                    .map((column) =>
                        column.columnDef.header ? (
                            <StyledMenuItem
                                key={column.id}
                                onClick={() => column.toggleVisibility(!column.getIsVisible())}
                                className='h-[44px]'
                            >
                                <StyledCheckbox
                                    size='small'
                                    dataTest='test'
                                    disableRipple
                                    className='p-0 pr-2'
                                    checked={column.getIsVisible()}
                                />
                                {column.columnDef.pinnedHeaderText
                                    ? column.columnDef.pinnedHeaderText
                                    : typeof column.columnDef.header === 'string'
                                    ? column.columnDef.header
                                    : column.id}
                            </StyledMenuItem>
                        ) : null,
                    )}
            </Popover>
        </div>
    )
}
