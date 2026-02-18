import type { Table } from '@tanstack/react-table'
import { useToggleMenuVisibility } from 'src/hooks/useToggleMenuVisibility.hook'
import styleTable from '../StyledTable.module.scss'
import { useMemo, useRef, useCallback } from 'react'
import { Popover, type PopoverOrigin } from '@mui/material'
import { ChevronDownIcon } from 'src/shared-components/ChevronDownIcon'
import { ChevronRightIcon } from 'src/shared-components/ChevronRightIcon'
import style from './TablePagination.module.scss'
import { ChevronLeftIcon } from 'src/shared-components/ChevronLeftIcon'
import { StyledButton } from 'src/shared-components/button'
import { StyledTooltip } from 'src/shared-components/tooltip'
import { StyledMenuItem } from 'src/shared-components/menu-item'

const amountOfRows = [10, 20, 50]

export function TablePagination<TData>({
    table,
    showRowSelect,
    locale,
}: {
    locale: 'en' | 'no'
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
    const tablePaginationRef = useRef<HTMLDivElement | null>(null)
    const isNo = locale === 'no'

    const popoverOrigin = useMemo(
        () => ({
            anchorOrigin: { vertical: -5, horizontal: 'center' } as PopoverOrigin,
            transformOrigin: { vertical: 'bottom', horizontal: 'center' } as PopoverOrigin,
        }),
        [],
    )

    const scrollToTop = useCallback(() => {
        const asmaTableClass = styleTable['asma-ui-table-styled-table']
        const tableContainer = tablePaginationRef.current?.closest(`.${asmaTableClass}`)

        const scrollContainer = tableContainer?.querySelector(
            `.${styleTable['table-scroll']}, .${styleTable['table-wrapper']}`,
        ) as HTMLElement

        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    const pagesLength = table.getPageCount() || 1
    const currentPage = table.getState().pagination.pageIndex + 1
    const pages = useMemo(() => Array.from({ length: pagesLength }, (_, index) => index + 1), [pagesLength])
    const pageSize = table.getState().pagination.pageSize

    const amountOfRowsOptions = useMemo(() => {
        const optionsSet = new Set([...amountOfRows, pageSize])
        return Array.from(optionsSet).sort((a, b) => a - b)
        // NOTE: this is required to keep the original pageSize as an option if the user wants to switch back
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePageChange = useCallback(
        (page: number) => {
            table.setPageIndex(page - 1)
            handleClose()
            scrollToTop()
        },
        [table, handleClose, scrollToTop],
    )

    const handleRowsChange = useCallback(
        (size: number) => {
            table.setPageSize(size)
            handleCloseRows()
        },
        [table, handleCloseRows],
    )

    return (
        <div ref={tablePaginationRef} className={style['table-pagination']}>
            {showRowSelect && (
                <>
                    <StyledButton
                        dataTest={'table-rows-count-button'}
                        variant={'outlined'}
                        size={'large'}
                        onClick={handleOpenRows}
                        endIcon={
                            <ChevronDownIcon
                                className={`${openRows ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`}
                                height={24}
                                width={24}
                            />
                        }
                    >
                        {pageSize} {isNo ? 'rader' : 'rows'}
                    </StyledButton>

                    <Popover
                        open={openRows}
                        anchorEl={anchorElRows}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: anchorElRows ? anchorElRows.clientWidth : undefined,
                                    maxHeight: 288,
                                    overflowY: 'auto',
                                },
                            },
                        }}
                        onClose={handleCloseRows}
                        anchorOrigin={popoverOrigin.anchorOrigin}
                        transformOrigin={popoverOrigin.transformOrigin}
                        classes={{ paper: 'border border-solid border-delta-200 py-2' }}
                    >
                        {amountOfRowsOptions.map((size) => (
                            <StyledMenuItem
                                key={size}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()

                                    handleRowsChange(size)
                                }}
                                selected={pageSize === size}
                            >
                                <span className={'text-delta-700 text-sm font-normal'}>
                                    {size} {isNo ? 'rader' : 'rows'}
                                </span>
                            </StyledMenuItem>
                        ))}
                    </Popover>
                </>
            )}

            <StyledTooltip title={isNo ? 'Nåværende side' : 'Current Page'}>
                <div>
                    <StyledButton
                        dataTest={'current-page-button'}
                        variant={'outlined'}
                        size={'large'}
                        onClick={handleOpen}
                        endIcon={
                            <ChevronDownIcon
                                className={`${open ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`}
                                height={24}
                                width={24}
                            />
                        }
                    >
                        {isNo ? 'Side' : 'Page'} {currentPage} {isNo ? 'av' : 'of'} {pagesLength}
                    </StyledButton>
                </div>
            </StyledTooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                slotProps={{
                    paper: {
                        sx: {
                            width: anchorEl ? anchorEl.clientWidth : undefined,
                            maxHeight: 288,
                            overflowY: 'auto',
                        },
                    },
                }}
                onClose={handleClose}
                anchorOrigin={popoverOrigin.anchorOrigin}
                transformOrigin={popoverOrigin.transformOrigin}
                classes={{ paper: 'border border-solid border-delta-200 py-2' }}
            >
                {pages.map((page) => (
                    <StyledMenuItem
                        key={page}
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            handlePageChange(page)
                        }}
                        selected={page === currentPage}
                    >
                        <span className={'text-delta-700 text-sm font-normal'}>
                            {isNo ? 'Side' : 'Page'} {page}
                        </span>
                    </StyledMenuItem>
                ))}
            </Popover>
            <StyledTooltip title={currentPage === 1 ? '' : isNo ? 'Forrige side' : 'Previous Page'}>
                <div>
                    <StyledButton
                        dataTest={'prev-page-button'}
                        variant={'outlined'}
                        onClick={() => {
                            table.previousPage()
                            scrollToTop()
                        }}
                        size={'large'}
                        disabled={!table.getCanPreviousPage()}
                        startIcon={<ChevronLeftIcon height={24} width={24} />}
                    />
                </div>
            </StyledTooltip>
            <StyledTooltip title={currentPage === pagesLength ? '' : isNo ? 'Neste side' : 'Next Page'}>
                <div>
                    <StyledButton
                        dataTest={'next-page-button'}
                        variant={'outlined'}
                        onClick={() => {
                            table.nextPage()
                            scrollToTop()
                        }}
                        size={'large'}
                        disabled={!table.getCanNextPage()}
                        startIcon={<ChevronRightIcon height={24} width={24} />}
                    />
                </div>
            </StyledTooltip>
        </div>
    )
}
