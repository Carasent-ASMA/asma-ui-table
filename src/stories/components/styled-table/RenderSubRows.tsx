import { useState } from 'react'
import type { Participant } from '../../helpers/makeData'
import { useTableSubRowsColumns } from './useTableSubRowsColumns'
import { StyledTable } from '../../../components/StyledTableIndex'
import { cloneDeep } from 'lodash-es'

export const RenderSubRows: React.FC<{ subRows: Participant[]; rowHeight: number }> = ({ subRows, rowHeight }) => {
    const { columns } = useTableSubRowsColumns()
    const [rowSelection, setRowSelection] = useState({})

    if (!subRows) return null

    return (
        <tr
            className='relative w-0 z-1 h-full'
            style={{
                height: `${
                    subRows.length * rowHeight + (subRows.length * 2 - subRows.length * 0.4) /* border */
                }px`,
            }}
        >
            <td className='absolute top-[-3px] left-0 right-0 border-none flex h-full'>
                <div className='w-full p-0 m-0'>
                    <StyledTable<Participant>
                        data={subRows}
                        columns={columns}
                        hideHeader
                        rowHeight={60}
                        initialState={{
                            columnVisibility: {
                                select: true,
                                fullName: true,
                            },
                        }}
                        enableResizing
                        state={{
                            rowSelection,
                        }}
                        onRowSelectionChange={(e) => {
                            setRowSelection(e)
                        }}
                        actions={(subRow) => [
                            {
                                label: 'Original',
                                onClick: () => console.info('original:', cloneDeep(subRow.original)),
                            },
                        ]}
                        hideFooter
                    />
                </div>
            </td>
        </tr>
    )
}
