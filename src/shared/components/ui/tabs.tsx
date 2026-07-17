import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/shared/utils/cn";
import { useI18n } from "@/shared/hooks";

// --- Updated Tabs Root ---
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ children, ...props }, ref) => {
  const { isRTL } = useI18n();
  
  return (
    <TabsPrimitive.Root 
      ref={ref} 
      dir={isRTL ? "rtl" : "ltr"} 
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

// --- Tabs List ---
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "link";
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center",
        variant === "default" &&
          "justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        variant === "link" && "gap-4",
        className,
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

// --- Tabs Trigger ---
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "link";
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap cursor-pointer font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "rounded-md px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        variant === "link" &&
          "px-0 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// --- Tabs Content ---
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };