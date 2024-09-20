import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Meta } from '@storybook/react'
import { StyledTable } from '../components/StyledTableIndex'
import type { ColumnDef } from '@tanstack/react-table'
import { StyledButton } from 'src/shared-components/button'
import { type Table } from '@tanstack/react-table'
import { StyledCheckbox } from 'src/shared-components/StyledCheckbox'

const meta: Meta<typeof StyledTable> = {
    title: '*/TableV3',
    component: StyledTable,
    tags: [],
    argTypes: {},
    args: {},
}

export default meta

interface IFixedTest {
    id: string
    text: string
}

export const TableV3 = () => {
    const columns = useColumns()
    const [data, setData] = useState(() =>
        Array.from({ length: 30 }, (_, index) => ({
            id: `row${index + 1}`,
            text: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit repudiandae earum reiciendis cum ad ipsa dolorum consequatur quam minus tenetur quaerat similique inventore, aut saepe? Optio perspiciatis molestias eligendi numquam.`,
        })),
    )
    const tableRef = useRef<Table<IFixedTest>>(null)
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        return loadColumnVisibilityInitState({ select: true })
    })
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        localStorage.setItem('tableV3columnVisibility', JSON.stringify(columnVisibility))
    }, [columnVisibility])

    useEffect(() => {
        const rows = Object.keys(tableRef?.current?.getSelectedRowModel().rowsById || {})
        console.info(rows)
    }, [rowSelection])

    return (
        <div className='border-2 border-solid border-black rounded-lg pl-8 pr-6 pt-8 pb-4 flex flex-col gap-2'>
            <StyledTable<IFixedTest, IFixedTest>
                stickyHeader={true}
                tableInstanceRef={tableRef}
                setData={(callback) => setData(callback(data))}
                className='h-[calc(100vh-140px)]'
                locale='en'
                data={data}
                columns={columns}
                actions={() => [{ label: 'Delete', disabled: true }]}
                enableColumnResizing={true}
                columnResizeMode='onChange'
                // expandArrow={true}
                // getRowCanExpand={() => true}
                defaultColumn={{
                    maxSize: 600,
                }}
                textExpandArrow={true}
                //focusable
                footer={(table) => getFooter(table, tableRef)}
                enableRowSelection={true}
                initialState={{ columnVisibility: { ...columnVisibility } }}
                state={{ rowSelection, columnVisibility }}
                onRowSelectionChange={(e) => setRowSelection(e)}
                onColumnVisibilityChange={setColumnVisibility}
                // rowHeight={60}
                pageSize={20}
                onRowClick={() => console.log('rowClick')}
                // enableResizing={true}
            />
        </div>
    )
}

const useColumns = () => {
    return useMemo<ColumnDef<IFixedTest, IFixedTest>[]>(() => {
        const createColumn = (data: {
            id: string
            headerText: string
            size?: number
            maxSize?: number
            fixedLeft?: boolean
        }): ColumnDef<IFixedTest> => {
            const { id, headerText, fixedLeft } = data

            return {
                enableResizing: id === 'col1' ? false : true,
                accessorFn: (row: IFixedTest) => row.text,
                id,
                header: () => <div className='truncate'>{headerText}</div>,
                pinnedHeaderText: headerText,
                cell: (info) => {
                    return (
                        <div className='flex items-start gap-[2px]'>
                            <div className='py-[14px]'>{info.row.original.text}</div>
                            {id === 'col1' && (
                                // if you want Checkbox to be visible -> Use <p> instead of <div>
                                <div className='mt-1'>
                                    <StyledCheckbox dataTest='' disabled={true} />
                                </div>
                            )}
                        </div>
                    )
                },
                minSize: 100,
                maxSize: data.maxSize,
                size: id === 'col1' ? data.size : undefined,
                fixedLeft,
            }
        }

        const columns: ColumnDef<IFixedTest>[] = Array.from({ length: 15 }, (_, index) =>
            createColumn({
                id: `col${index + 1}`,
                headerText: `Header ${index + 1}`,
                size: index === 0 ? 200 : 140,
                maxSize: 500,
                fixedLeft: index === 0,
            }),
        )

        return columns
    }, [])
}

const getFooter = (table: Table<IFixedTest>, tableRef: React.RefObject<Table<IFixedTest>>) => {
    return (
        <div className='uppercase font-semibold text-gama-500 mr-2 flex gap-4 items-center'>
            <StyledButton
                className='self-end uppercase'
                variant='text'
                dataTest='toggle-selection-tableV3'
                onClick={() =>
                    tableRef.current?.setColumnVisibility((old) => ({
                        ...old,
                        select: !old['select'],
                    }))
                }
            >
                Toggle row selection
            </StyledButton>
            <div>columns - {table.getAllColumns().length}</div>
        </div>
    )
}

const loadColumnVisibilityInitState = (basicData: Record<string, boolean>): Record<string, boolean> => {
    const localStorageColumnVisibility = localStorage.getItem('tableV3columnVisibility')
    let localStorageColumnVisibilityParsed: Record<string, boolean> | null = null
    localStorageColumnVisibility && (localStorageColumnVisibilityParsed = JSON.parse(localStorageColumnVisibility))
    return localStorageColumnVisibilityParsed || basicData
}

// const Styles: CSSProperties = {
//     overflow: 'inherit',
//     textOverflow: 'inherit',
//     whiteSpace: 'inherit',
// }
