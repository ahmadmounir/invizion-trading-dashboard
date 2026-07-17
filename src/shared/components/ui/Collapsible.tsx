import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "@/shared/utils/cn"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <>
    <style dangerouslySetInnerHTML={{ __html: `
      .collapsible-content-animated[data-state='open'] {
        animation: slideDown 200ms ease-out;
      }
      .collapsible-content-animated[data-state='closed'] {
        animation: slideUp 200ms ease-out;
      }

      @keyframes slideDown {
        from { height: 0; opacity: 0; }
        to { height: var(--radix-collapsible-content-height); opacity: 1; }
      }

      @keyframes slideUp {
        from { height: var(--radix-collapsible-content-height); opacity: 1; }
        to { height: 0; opacity: 0; }
      }
    `}} />
    
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      className={cn(
        "collapsible-content-animated overflow-hidden transition-all",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  </>
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }