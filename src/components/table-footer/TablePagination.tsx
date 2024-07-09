import type { Table } from '@tanstack/react-table'
import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import styleTable from '../StyledTable.module.scss'
import { useRef } from 'react'
import clsx from 'clsx'
import { Popover, Tooltip } from '@mui/material'
import { ChevronUpIcon } from 'src/shared-components/ChevronUpIcon'
import { ChevronDownIcon } from 'src/shared-components/ChevronDownIcon'
import { ChevronRightIcon } from 'src/shared-components/ChevronRightIcon'
import style from './TablePagination.module.scss'
import { StyledButton } from 'src/shared-components/StyledButton'
import { ChevronLeftIcon } from 'src/shared-components/ChevronLeftIcon'
import { CheckIcon } from 'src/shared-components/CheckIcon'

export function TablePagination<TData>({ table, locale }: { locale: 'en' | 'no'; table: Table<TData> }) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()
    const tablePagination = useRef<HTMLDivElement | null>(null)
    const isNo = locale === 'no'

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        handleOpen(event)
    }
    const AsmaCoreUiStyledTable = styleTable['asma-ui-table-styled-table']
    const scrollToTop = () => {
        tablePagination?.current
            ?.closest(`.${AsmaCoreUiStyledTable}`)
            ?.querySelectorAll('[data-index="0"]')?.[0]
            ?.scrollIntoView({ block: 'center', inline: 'start' })
    }

    const pagesLength = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1
    const pages = Array.from({ length: pagesLength }, (_value, index) => index + 1)
    return pagesLength > 1 ? (
        <div ref={tablePagination} className={style['table-pagination']}>
            <Tooltip title={isNo ? 'Nåværende side' : 'Current Page'}>
                <div>
                    <StyledButton
                        size='small'
                        variant='outlined'
                        style={{ minWidth: '140px', height: 32 }}
                        onClick={handleClick}
                        endIcon={
                            open ? <ChevronUpIcon height={24} width={24} /> : <ChevronDownIcon height={24} width={24} />
                        }
                    >
                        {isNo ? 'Side' : 'Page'} {currentPage} {isNo ? 'av' : 'of'} {pagesLength}
                    </StyledButton>
                </div>
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: -5,
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <div className={style['table-pagination__pages-list']}>
                    {pages.map((page) => {
                        return (
                            <div
                                className={clsx(
                                    style['table-pagination__pages-list__page'],
                                    currentPage === page && 'page-selected',
                                )}
                                key={page}
                                onClick={() => {
                                    table.setPageIndex(page - 1)
                                    handleClose()
                                    scrollToTop()
                                }}
                            >
                                {currentPage === page && (
                                    <CheckIcon className={style['check-icon']} height={24} width={24} />
                                )}
                                <span>
                                    {isNo ? 'Side' : 'Page'} {page}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </Popover>
            <Tooltip title={currentPage === 1 ? '' : isNo ? 'Forrige side' : 'Previous Page'}>
                <div>
                    <StyledButton
                        size='small'
                        variant='outlined'
                        onClick={() => {
                            table.previousPage()
                            scrollToTop()
                        }}
                        disabled={!table.getCanPreviousPage()}
                        style={{ minWidth: 40, width: 40 }}
                    >
                        <ChevronLeftIcon height={24} width={24} />
                    </StyledButton>
                </div>
            </Tooltip>
            <Tooltip title={currentPage === pagesLength ? '' : isNo ? 'Neste side' : 'Next Page'}>
                <div>
                    <StyledButton
                        size='small'
                        variant='outlined'
                        onClick={() => {
                            table.nextPage()
                            scrollToTop()
                        }}
                        disabled={!table.getCanNextPage()}
                        style={{ minWidth: 40, width: 40 }}
                    >
                        <ChevronRightIcon height={24} width={24} />
                    </StyledButton>
                </div>
            </Tooltip>
        </div>
    ) : null
}
