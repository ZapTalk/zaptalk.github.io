import * as React from "react"
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-full", className)} {...props}>
    <OverlayScrollbarsComponent
      defer
      options={{
        scrollbars: {
          theme: 'os-theme-dark',
          visibility: 'auto',
          autoHide: 'leave',
          autoHideDelay: 800,
        },
        overflow: {
          x: 'hidden',
        },
      }}
      className="h-full w-full"
    >
      {children}
    </OverlayScrollbarsComponent>
  </div>
))
ScrollArea.displayName = "ScrollArea"

// Keep ScrollBar for compatibility but make it a no-op
const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(() => null)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
