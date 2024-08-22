import React, { useState } from 'react'
import type { Meta } from '@storybook/react'
import { StyledTable } from '../components/StyledTableIndex'
import { useFetchTemplates } from './service/useFetchTemplates'
import { useColumns } from './components/styled-flex-table/useColumns'
import type { ITemplate } from './service/types'
import { generateActions } from './components/styled-flex-table/generateActions'
import { cloneDeep } from 'lodash-es'

const meta = {
    title: '*/Table',
    component: StyledTable,
    tags: [],
    argTypes: {},
    args: {},
} satisfies Meta<typeof StyledTable>

export default meta

const templates = [
    {
        id: '1',
        context: 'Email',
        archived: 'false',
        title: 'Welcome Email',
        template_uuid: 'uuid-1',
        valid_days: '30',
        updated_at: '2024-01-01T10:00:00Z',
    },
    {
        id: '2',
        context: 'Notification',
        archived: 'true',
        title: 'Password Reset',
        template_uuid: 'uuid-2',
        valid_days: '7',
        updated_at: '2024-01-02T10:00:00Z',
    },
    {
        id: '3',
        context: 'Alert',
        archived: 'false',
        title: 'Account Suspended',
        template_uuid: 'uuid-3',
        valid_days: '14',
        updated_at: '2024-01-03T10:00:00Z',
    },
    {
        id: '4',
        context: 'Reminder',
        archived: 'false',
        title: 'Subscription Renewal',
        template_uuid: 'uuid-4',
        valid_days: '60',
        updated_at: '2024-01-04T10:00:00Z',
    },
    {
        id: '5',
        context: 'Email',
        archived: 'true',
        title: 'Verification Email',
        template_uuid: 'uuid-5',
        valid_days: '1',
        updated_at: '2024-01-05T10:00:00Z',
    },
    {
        id: '6',
        context: 'Notification',
        archived: 'false',
        title: 'New Feature Announcement',
        template_uuid: 'uuid-6',
        valid_days: '365',
        updated_at: '2024-01-06T10:00:00Z',
    },
    {
        id: '7',
        context: 'Alert',
        archived: 'true',
        title: 'Security Alert',
        template_uuid: 'uuid-7',
        valid_days: '30',
        updated_at: '2024-01-07T10:00:00Z',
    },
    {
        id: '8',
        context: 'Reminder',
        archived: 'false',
        title: 'Event Reminder',
        template_uuid: 'uuid-8',
        valid_days: '2',
        updated_at: '2024-01-08T10:00:00Z',
    },
    {
        id: '9',
        context: 'Email',
        archived: 'false',
        title: 'Newsletter',
        template_uuid: 'uuid-9',
        valid_days: '90',
        updated_at: '2024-01-09T10:00:00Z',
    },
    {
        id: '10',
        context: 'Notification',
        archived: 'false',
        title: 'Billing Update',
        template_uuid: 'uuid-10',
        valid_days: '180',
        updated_at: '2024-01-10T10:00:00Z',
    },
]

export const Table = () => {
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
