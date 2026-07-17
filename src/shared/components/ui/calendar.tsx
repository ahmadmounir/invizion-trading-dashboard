import * as React from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { arSA, enUS, tr } from "date-fns/locale";
import { cn } from "@/shared/utils/cn";
import { buttonVariants } from "./button-variants";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const getDayPickerLocale = (language: string) => {
  if (language.startsWith("ar")) return arSA;
  if (language.startsWith("tr")) return tr;
  return enUS;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const isRTL = language.startsWith("ar");
  const locale = getDayPickerLocale(language);
  const currentYear = new Date().getFullYear();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      dir={isRTL ? "rtl" : "ltr"}
      captionLayout="dropdown"
      fromYear={props.fromYear ?? 1900}
      toYear={props.toYear ?? currentYear + 10}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 relative", // Added 'relative' here to anchor the buttons
        month_caption: "flex justify-center pt-2 items-center h-10", // Added fixed height for easier centering
        caption_label: "hidden",
        dropdowns: "flex justify-center gap-1 z-20", // Added z-index to keep dropdowns clickable
        dropdown_root: "relative",
        dropdown:
          "h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none",
        nav: "static", // Changed from 'flex' to 'static' so absolute positioning works correctly
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute start-1 top-40 z-10", // Top-2 aligns it with the dropdowns
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute end-1 top-40 z-10", // Top-2 aligns it with the dropdowns
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex gap-2",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2 gap-2",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        // FIX: Use 'short' or 'narrow' instead of 'long' to prevent overflow
        formatWeekdayName: (date) =>
          date.toLocaleDateString(language, { weekday: "short" }),
        ...props.formatters,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon =
            orientation === "left"
              ? isRTL
                ? ChevronRight
                : ChevronLeft
              : isRTL
                ? ChevronLeft
                : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
        ...props.components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
