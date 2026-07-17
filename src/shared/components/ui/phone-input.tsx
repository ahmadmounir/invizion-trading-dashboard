import * as React from "react";
import { Input } from "./Input";
import { cn } from "@/shared/utils/cn";

export interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "dir" | "value"
  > {
  /** 10-digit local number, e.g. "5551234567" (no "90" country code). */
  value: string | undefined;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, placeholder = "5xxxxxxxxx", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
      onChange(digitsOnly);
    };

    return (
      <div className={cn("relative flex items-center", className)} dir="ltr">
        <div className="absolute start-0 h-full flex items-center px-3 font-medium border-e my-auto pointer-events-none bg-muted/20 rounded-s-md">
          +90
        </div>
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          dir="ltr"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          maxLength={10}
          className="ps-16"
          {...props}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
