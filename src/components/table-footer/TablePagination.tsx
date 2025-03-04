import type { Table } from '@tanstack/react-table'
import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import styleTable from '../StyledTable.module.scss'
import { useMemo, useRef } from 'react'
import clsx from 'clsx'
import { Popover, Tooltip } from '@mui/material'
import { ChevronUpIcon } from 'src/shared-components/ChevronUpIcon'
import { ChevronDownIcon } from 'src/shared-components/ChevronDownIcon'
import { ChevronRightIcon } from 'src/shared-components/ChevronRightIcon'
import style from './TablePagination.module.scss'
import { ChevronLeftIcon } from 'src/shared-components/ChevronLeftIcon'
import { CheckIcon } from 'src/shared-components/CheckIcon'
import { StyledButton } from 'src/shared-components/button'

const amountOfRows = [10, 20, 50]

export function TablePagination<TData>({
    table,
    pageSize,
    showRowSelect,
    locale,
}: {
    locale: 'en' | 'no'
    pageSize: number
    showRowSelect: boolean
    table: Table<TData>
}) {
    const { anchorEl, open, handleClose, handleOpen } = useToggleMenuVisibility()
    const {
        anchorEl: anchorElRows,
        open: openRows,
        handleClose: handleCloseRows,
        handleOpen: handleOpenRows,
    } = useToggleMenuVisibility()
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

    const pagesLength = table.getPageCount() || 1
    const currentPage = table.getState().pagination.pageIndex + 1
    const pages = useMemo(() => Array.from({ length: pagesLength }, (_, index) => index + 1), [pagesLength])

    const amountOfRowsOptions = useMemo(() => {
        const optionsSet = new Set([...amountOfRows, pageSize])
        return Array.from(optionsSet).sort((a, b) => a - b)
    }, [pageSize])

    return (
        <div ref={tablePagination} className={style['table-pagination']}>
            {showRowSelect && (
                <>
                    <StyledButton
                        dataTest='table-rows-count-button'
                        variant='outlined'
                        style={{ minWidth: '90px' }}
                        onClick={(e) => handleOpenRows(e)}
                        endIcon={
                            openRows ? (
                                <ChevronUpIcon height={24} width={24} />
                            ) : (
                                <ChevronDownIcon height={24} width={24} />
                            )
                        }
                    >
                        {pageSize} {isNo ? 'rader' : 'rows'}
                    </StyledButton>

                    <Popover
                        open={openRows}
                        anchorEl={anchorElRows}
                        onClose={handleCloseRows}
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
                            {amountOfRowsOptions.map((size) => {
                                return (
                                    <div
                                        className={clsx(
                                            style['table-pagination__pages-list__page'],
                                            pageSize === size && 'page-selected',
                                        )}
                                        key={size}
                                        onClick={() => {
                                            table.setPageSize(size)
                                            handleCloseRows()
                                            // scrollToTop()
                                        }}
                                    >
                                        {pageSize === size && (
                                            <CheckIcon className={style['check-icon']} height={24} width={24} />
                                        )}
                                        <span>
                                            {size} {isNo ? 'rader' : 'rows'}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </Popover>
                </>
            )}

            <Tooltip title={isNo ? 'Nåværende side' : 'Current Page'}>
                <div>
                    <StyledButton
                        dataTest=''
                        variant='outlined'
                        style={{ minWidth: '140px' }}
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
                        dataTest=''
                        variant='outlined'
                        onClick={() => {
                            table.previousPage()
                            scrollToTop()
                        }}
                        disabled={!table.getCanPreviousPage()}
                        style={{ minWidth: 40, width: 40 }}
                        startIcon={<ChevronLeftIcon height={24} width={24} />}
                    />
                </div>
            </Tooltip>
            <Tooltip title={currentPage === pagesLength ? '' : isNo ? 'Neste side' : 'Next Page'}>
                <div>
                    <StyledButton
                        dataTest=''
                        variant='outlined'
                        onClick={() => {
                            table.nextPage()
                            scrollToTop()
                        }}
                        disabled={!table.getCanNextPage()}
                        style={{ minWidth: 40, width: 40 }}
                        startIcon={<ChevronRightIcon height={24} width={24} />}
                    />
                </div>
            </Tooltip>
        </div>
    )
}
