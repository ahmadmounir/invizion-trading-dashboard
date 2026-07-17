import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { Button } from "./Button";
import { cn } from "@/shared/utils/cn";

interface AvatarUploadProps {
  /** Locally-selected file (takes precedence over previewUrl for preview). */
  file: File | null;
  /** Existing/remote image URL (e.g. current avatar from the server). */
  previewUrl?: string | null;
  /** Called with the selected File, or null when the image is removed. */
  onFileChange: (file: File | null) => void;
  /** Initials shown when there is no image. */
  fallback?: string;
  chooseText?: string;
  changeText?: string;
  removeText?: string;
  disabled?: boolean;
  accept?: string;
  className?: string;
  size?: number; // in rem, default 28 (112px)
}

/**
 * Circular avatar picker with preview + remove. Selection only — the parent
 * decides when to upload (onboarding uploads on finish, settings on change).
 * Shared between the onboarding image step and the settings profile section.
 */
export function AvatarUpload({
  file,
  previewUrl,
  onFileChange,
  fallback,
  chooseText = "Add photo",
  changeText = "Change photo",
  removeText = "Remove",
  disabled = false,
  accept = "image/*",
  size = 28,
  className,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Build (and clean up) an object URL for the locally-selected file.
  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shownSrc = localPreview || previewUrl || undefined;
  const hasImage = !!shownSrc;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileChange(selected);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={`group relative cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed`}
        aria-label={hasImage ? changeText : chooseText}
      >
        <Avatar
          style={{ width: `${size * 0.25}rem`, height: `${size * 0.25}rem` }}
        >
          {shownSrc ? (
            <AvatarImage src={shownSrc} alt="" className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-2xl font-medium text-primary">
            {fallback || <Camera className="size-8 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-7 text-white" />
        </span>
      </button>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          {hasImage ? changeText : chooseText}
        </Button>
        {hasImage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
            disabled={disabled}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="me-1 size-4" />
            {removeText}
          </Button>
        )}
      </div>
    </div>
  );
}
