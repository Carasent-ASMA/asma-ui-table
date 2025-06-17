import { createContext, useContext, useState, type FunctionComponent, type PropsWithChildren } from 'react'

interface RootContextType {
    expandedRows: Set<string>
    toggleExpand: (id: string) => void
    enableResizingFlag: () => void
    disableResizingFlag: () => void
    isResizing: boolean
}

const RootContext = createContext<RootContextType | undefined>(undefined)

export const RootContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [isResizing, setIsResizing] = useState(false)

    const enableResizingFlag = () => setIsResizing(true)
    const disableResizingFlag = () => setIsResizing(false)

    const toggleExpand = (id: string) => {
        setExpandedRows((prev) => {
            const newExpandedRows = new Set(prev)

            if (newExpandedRows.has(id)) newExpandedRows.delete(id)
            else newExpandedRows.add(id)

            return newExpandedRows
        })
    }

    const context = {
        expandedRows,
        toggleExpand,
        enableResizingFlag,
        disableResizingFlag,
        isResizing,
    } satisfies RootContextType

    return <RootContext.Provider value={context}>{children}</RootContext.Provider>
}

export const useRootContext = () => {
    const context = useContext(RootContext)

    if (!context) {
        throw new Error('useRootContext must be used within a RootContextProvider')
    }

    return context
}
