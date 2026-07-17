import { useRef } from "react";
import { User as UserIcon } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { useI18n } from "@/shared/hooks/useI18n";

interface ProfileImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  alt: string;
  isUploading: boolean;
  isRemoving: boolean;
  onFileSelect: (file: File) => void;
  onInvalidFileType: () => void;
  onRequestRemove: () => void;
}

export function ProfileImageModal({
  open,
  onOpenChange,
  imageUrl,
  alt,
  isUploading,
  isRemoving,
  onFileSelect,
  onInvalidFileType,
  onRequestRemove,
}: ProfileImageModalProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBusy = isUploading || isRemoving;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onInvalidFileType();
      return;
    }

    onFileSelect(file);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isBusy) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:min-w-[380px] max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("settings:profileImage.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full flex items-center justify-center">
            {isUploading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            ) : imageUrl ? (
              <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-14 w-14 text-muted-foreground/40" />
            )}
          </div>
          <p className="text-center text-muted-foreground">
            {t("settings:profileImage.hint")}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isBusy}
        />

        <DialogFooter className="flex justify-center">
          {imageUrl && (
            <Button
              type="button"
              variant="destructive"
              onClick={onRequestRemove}
              disabled={isBusy}
            >
              {isRemoving ? t("common:removing") : t("common:delete")}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
          >
            {isUploading ? t("common:updating") : t("common:uploadImage")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
