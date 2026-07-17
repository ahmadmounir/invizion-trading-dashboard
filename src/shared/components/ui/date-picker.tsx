import { format } from "date-fns";
import { arSA, enUS, tr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "./Button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";

  const dateLocale = language.startsWith("ar")
    ? arSA
    : language.startsWith("tr")
      ? tr
      : enUS;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-start font-normal",
            !date && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="me-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: dateLocale })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={(date) => {
            const isBeforeMin = minDate ? date < minDate : false;
            const isAfterMax = maxDate ? date > maxDate : false;
            return isBeforeMin || isAfterMax;
          }}
          initialFocus
          className="rounded-md border-0 shadow-none"
        />
      </PopoverContent>
    </Popover>
  );
}
