import React, { useState } from 'react'
import type { Meta } from '@storybook/react'
import { StyledTable } from '../components/StyledTableIndex'
import { useFetchTemplates } from './service/useFetchTemplates'
import { useColumns } from './components/styled-flex-table/useColumns'
import type { ITemplate } from './service/types'
import { generateActions } from './components/styled-flex-table/generateActions'
import { cloneDeep } from 'lodash-es'

const meta = {
    title: '*/TGrini',
    component: StyledTable,
    tags: [],
    argTypes: {},
    args: {},
} satisfies Meta<typeof StyledTable>

export default meta

export const TGrini = () => {
    const { data } = useFetchTemplates()
    const { columns } = useColumns()

    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState({})

    return (
        <div className='mx-auto max-w-[1200px] flex flex-col gap-10'>
            <StyledTable<ITemplate, ITemplate>
                stickyHeader
                enableResizing
                className='h-[calc(100vh-130px)]'
                locale='no'
                data={data}
                columns={columns}
                actions={(row) => generateActions(row)}
                state={{
                    globalFilter,
                    rowSelection,
                }}
                onRowSelectionChange={(e) => {
                    setRowSelection(e)
                }}
                onRowClick={(e, row) => {
                    console.info('e', e, cloneDeep(row.original))
                }}
                onGlobalFilterChange={setGlobalFilter}
                noRowsOverlay={
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='flex flex-col items-center'>No recipients found</div>
                    </div>
                }
                rowHeight={40}
                pageSize={30}
                footer={(table) => {
                    return <div>columns - {table.getAllColumns().length}</div>
                }}
            />
        </div>
    )
}
