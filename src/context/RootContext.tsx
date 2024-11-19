import React, { createContext, useContext, useState, type ReactNode } from 'react'

interface RootContextType {
    expandedRows: Set<string>
    toggleExpand: (id: string) => void
    enableResizingFlag: () => void
    disableResizingFlag: () => void
    isResizing: boolean
}

const RootContext = createContext<RootContextType | undefined>(undefined)

export const RootContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [isResizing, setIsResizing] = useState(false)

    const enableResizingFlag = () => setIsResizing(true)
    const disableResizingFlag = () => setIsResizing(false)

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
        <RootContext.Provider
            value={{ expandedRows, toggleExpand, enableResizingFlag, disableResizingFlag, isResizing }}
        >
            {children}
        </RootContext.Provider>
    )
}

export const useRootContext = () => {
    const context = useContext(RootContext)
    if (context === undefined) {
        throw new Error('useRootContext must be used within a RootContextProvider')
    }
    return context
}
