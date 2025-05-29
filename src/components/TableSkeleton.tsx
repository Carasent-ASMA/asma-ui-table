import { Skeleton } from '@mui/material'
import { Fragment, type FunctionComponent } from 'react'

export const TableSkeleton = (({ colSpan, rowHeight = 48 }) => (
    <Fragment>
        {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index}>
                <td colSpan={colSpan} height={rowHeight} className={'last:pb-0 first:pt-2 pb-2'}>
                    <Skeleton
                        key={index}
                        variant={'rectangular'}
                        width={'100%'}
                        height={40}
                        sx={{ backgroundColor: 'var(--colors-delta-50)', borderRadius: '8px' }}
                    />
                </td>
            </tr>
        ))}
    </Fragment>
)) satisfies FunctionComponent<{ colSpan: number; rowHeight?: number }>
