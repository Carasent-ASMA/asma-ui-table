import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { ChevronDownIcon } from 'src/shared-components/ChevronDownIcon'
import { SHOW_FULL_TEXT_ID, type CellContext } from 'src/types'

interface ShowFullTextContextType {
    expandedRows: Set<string>
    toggleExpand: (id: string) => void
}

const ShowFullTextContext = createContext<ShowFullTextContextType | undefined>(undefined)

export const ShowFullTextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        setExpandedRows((prev) => {
            const newExpandedRows = new Set(prev)
            if (newExpandedRows.has(id)) {
                newExpandedRows.delete(id)
            } else {
                newExpandedRows.add(id)
            }
            return newExpandedRows
        })
    }

    return (
        <ShowFullTextContext.Provider value={{ expandedRows, toggleExpand }}>{children}</ShowFullTextContext.Provider>
    )
}

export const useShowFullText = () => {
    const context = useContext(ShowFullTextContext)
    if (context === undefined) {
        throw new Error('useShowFullText must be used within a ShowFullTextProvider')
    }
    return context
}

export function generateShowFullTextColumn<TData>(isFixed: boolean, rowHeight?: number) {
    return {
        id: SHOW_FULL_TEXT_ID,
        minSize: 40,
        maxSize: 40,
        size: 40,
        enableHiding: false,
        enableSorting: false,
        header: () => null,
        cell: (info: CellContext<TData, TData>) => {
            return <ShowFullTextCell info={info} rowHeight={rowHeight} />
        },
        fixedLeft: isFixed,
    }
}

function ShowFullTextCell<TData>({ info, rowHeight }: { info: CellContext<TData, TData>; rowHeight?: number }) {
    const { expandedRows, toggleExpand } = useShowFullText()
    const isExpanded = expandedRows.has(info.row.id)

    const canRenderSubRows = info.row.getCanExpand()

    return (
        <div
            className='flex w-full items-center justify-center'
            style={{ height: rowHeight ? rowHeight : 'auto' }}
            onClick={() => {
                if (canRenderSubRows) info.row.getToggleExpandedHandler()()
                toggleExpand(info.row.id)
            }}
            onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            onMouseUp={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <div
                style={{
                    rotate: isExpanded ? '180deg' : '0deg',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDuration: '500ms',
                }}
            >
                <ChevronDownIcon width={20} height={20} color='var(--colors-gray-700)' />
            </div>
        </div>
    )
}
