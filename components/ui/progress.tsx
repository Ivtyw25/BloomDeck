"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ProgressContext = React.createContext<{ value: number | null }>({ value: null })

const Progress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value, children, ...props }, ref) => (
    <ProgressContext.Provider value={{ value: value || 0 }}>
        <div
            ref={ref}
            className={cn("w-full flex flex-col", className)}
            {...props}
        >
            {children}
        </div>
    </ProgressContext.Provider>
))
Progress.displayName = "Progress"

const ProgressLabel = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm font-medium leading-none", className)}
        {...props}
    />
))
ProgressLabel.displayName = "ProgressLabel"

const ProgressValue = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
    const { value } = React.useContext(ProgressContext)
    return (
        <span
            ref={ref}
            className={cn("font-medium", className)}
            {...props}
        >
            {Math.round(value || 0)}
        </span>
    )
})
ProgressValue.displayName = "ProgressValue"

const ProgressTrack = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { value } = React.useContext(ProgressContext)
    return (
        <div
            ref={ref}
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-gray-100",
                className
            )}
            {...props}
        >
            <div
                className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </div>
    )
})
ProgressTrack.displayName = "ProgressTrack"

export { Progress, ProgressLabel, ProgressValue, ProgressTrack }
