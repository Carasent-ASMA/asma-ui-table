import React, { useMemo, useState } from 'react'
import type { Meta } from '@storybook/react'
import { StyledTable } from '../components/StyledTableIndex'
import type { ColumnDef } from '@tanstack/react-table'
import { RowDragHandleCell } from 'src/components/columns/dndHandleColumn'

const meta: Meta<typeof StyledTable> = {
    title: '*/TableV3',
    component: StyledTable,
    tags: [],
    argTypes: {},
    args: {},
}

export default meta

export const TableV3 = () => {
    const columns = useColumns()
    const [data, setData] = useState(() =>
        Array.from({ length: 30 }, (_, index) => ({
            id: (index + 1).toString(),
            name: `test${index + 1}`,
        })),
    )

    return (
        <StyledTable<IFixedTest, IFixedTest>
            stickyHeader
            enableDnd
            customDndColumnProps={{
                header: 'Order',
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <RowDragHandleCell rowId={row.id} />
                        <span className='text-delta-800 text-base font-semibold'>{row.original.id}</span>
                    </div>
                ),
            }}
            setData={(callback) => setData(callback(data))}
            enableResizing
            className='h-[calc(100vh-130px)] scrollbar-thin overflow-auto'
            locale='en'
            data={data}
            columns={columns}
            actions={useActions}
            rowHeight={60}
            focusable
        />
    )
}

const useColumns = () => {
    return useMemo<ColumnDef<IFixedTest, IFixedTest>[]>(() => {
        const createColumn = (id: string, header: string, minSize: number, fixedLeft = false) => ({
            accessorFn: (row: IFixedTest) => row.name,
            id,
            header,
            cell: (info: { row: { original: IFixedTest } }) => (
                <span>{info.row.original.name}</span>
            ),
            minSize,
            fixedLeft,
        })

        return [
            createColumn('name1', 'Name1', 200),
            createColumn('name2', 'Name2', 200),
            createColumn('name3', 'Name3', 200),
            createColumn('name4', 'Name4', 200),
            createColumn('name5', 'Name5', 200),
            createColumn('name6', 'Name6', 200),
            createColumn('name7', 'Name7', 200),
            createColumn('name8', 'Name8', 200),
            createColumn('name9', 'Name9', 200),
            createColumn('name10', 'Name10', 200),
            createColumn('name11', 'Name11', 200),
            createColumn('name12', 'Name12', 200),
            createColumn('name13', 'Name13', 200),
            createColumn('name14', 'Name14', 200),
            createColumn('name15', 'Name15', 200),
        ]
    }, [])
}

interface IFixedTest {
    id: string
    name: string
}

const useActions = () => [{ label: 'Delete', disabled: true }]
