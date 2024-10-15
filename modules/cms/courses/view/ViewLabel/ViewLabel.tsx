import React from 'react'

interface ViewLabelProps {
    children: any,
    className?: any,
}
export const ViewLabel = ({
    children,
    className = ""
}: ViewLabelProps) => {
    return (
        <div className={`h-12 text-white ${className}`}>
            {children}
        </div>
    )
}