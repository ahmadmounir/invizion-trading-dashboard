import { useState, useRef } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { Input } from "@/shared/components/ui";
import { cn } from "@/shared/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const OtpInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  if (inputRefs.current.length !== length) {
    inputRefs.current = Array(length)
      .fill(null)
      .map((_, i) => inputRefs.current[i] || null);
  }

  const digits = value.split("").slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Only allow single digit
    const newDigit = digit.slice(-1);

    // Only allow numbers
    if (newDigit && !/^\d$/.test(newDigit)) return;

    const newDigits = [...digits];
    newDigits[index] = newDigit;
    const newValue = newDigits.join("");

    onChange(newValue);

    // Move to next input if digit was entered
    if (newDigit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();

      if (digits[index]) {
        // Clear current digit
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        focusInput(index - 1);
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }

    // Handle delete key
    if (e.key === "Delete") {
      e.preventDefault();
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join(""));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");

    // Extract only digits from pasted content
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, length);

    if (pastedDigits) {
      onChange(pastedDigits);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedDigits.length, length - 1);
      focusInput(nextIndex);
    }
  };

  return (
    <div className={cn("flex justify-center gap-2 flex-wrap", className)}>
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          disabled={disabled}
          className={cn(
            "h-12 w-10 sm:h-14 sm:w-14 text-center text-xl font-bold", // قياس أصغر للموبايل وأكبر للـ Desktop
            "border focus-visible:ring-offset-0", // زيادة سماكة الحدود للتركيز
            focusedIndex === index ? "border-primary" : "border-slate-200",
            digit && "border-primary bg-primary/5", // تلوين الخانة الممتلئة
            disabled && "opacity-50 cursor-not-allowed",
          )}
          autoComplete="off"
        />
      ))}
    </div>
  );
};
