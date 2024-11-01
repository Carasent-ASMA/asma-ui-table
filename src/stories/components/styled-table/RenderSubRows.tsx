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
            className='relative top-[-3px]'
            style={{
                height: `${subRows.length * rowHeight}px`,
            }}
        >
            <td className='absolute top-0 left-0 right-0 flex overflow-hidden h-[calc(100%+3px)] border-b border-solid border-b-delta-300'>
                <div className='w-full p-0 m-0'>
                    <StyledTable<Participant>
                        data={subRows}
                        columns={columns}
                        hideHeader
                        rowHeight={rowHeight}
                        initialState={{
                            columnVisibility: {
                                select: true,
                                fullName: true,
                            },
                        }}
                        className='w-fit'
                        // enableResizing
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
