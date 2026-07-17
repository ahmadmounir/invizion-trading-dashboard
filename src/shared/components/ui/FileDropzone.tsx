import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/shared/utils/cn";

interface FileDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  accept?: string;
  chooseFileText?: string;
  dragOrClickText?: string;
}

export function FileDropzone({
  file,
  onChange,
  className,
  accept,
  chooseFileText = "Choose a file",
  dragOrClickText = "or drag it here",
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />

      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        className={cn(
          "w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/5",
          className,
        )}
      >
        {file ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="size-5 text-primary" />
              </div>
              <div className="min-w-0 text-start">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto size-12 rounded-full bg-accent flex items-center justify-center">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{chooseFileText}</p>
              <p className="text-sm text-muted-foreground">{dragOrClickText}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
