import { Popover } from '@mui/material'
import type { HeaderContext } from '@tanstack/react-table'
import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import { PinIcon } from 'src/shared-components/PinIcon'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'
import { StyledMenuItem } from 'src/shared-components/StyledMenuItem'
import { INTERNAL_COLUMN_IDS, SELECT_COLUMN_ID } from 'src/types'

import styles from './TableActions.module.scss'

export function HeaderActionMenu<TData>({ headerData }: { headerData: HeaderContext<TData, TData> }) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()

    const isAnyColumnHidden = headerData.table
        .getAllLeafColumns()
        .some((col) => col.getCanHide() && !col.getIsVisible() && !INTERNAL_COLUMN_IDS.includes(col.id))

    return (
        <div className='flex absolute-center items-center justify-end w-full'>
            <div className={styles['actions-header']} onClick={handleOpen}>
                <PinIcon className={styles['pin-icon']} />
                {isAnyColumnHidden && <div className={styles['pin-indicator']}></div>}
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
