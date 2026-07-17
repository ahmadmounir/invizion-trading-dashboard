import { useState } from "react";
import { Camera, Pencil, User as UserIcon } from "lucide-react";
import type { PublicUser } from "@/shared/types/user";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import { useProfileStore } from "@/shared/stores/profileStore";
import { updateStoredUser } from "@/shared/services/localAuth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ConfirmDialog,
} from "@/shared/components/ui";
import { ProfileImageModal } from "../components/profile-image-modal";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface ProfileImageSectionProps {
  profile: PublicUser;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Settings profile-image trigger. Clicking the avatar opens a modal where the
 * image is picked and converted to a base64 data URI — there's no backend, so
 * it's stored directly on the profile (Zustand + localStorage).
 */
export function ProfileImageSection({ profile }: ProfileImageSectionProps) {
  const { t } = useI18n();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const handleFileSelect = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast.error(t("settings:profileImage.tooLarge"));
      return;
    }
    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      updateProfile({ imageUrl: base64 });
      updateStoredUser(profile.id, { imageUrl: base64 });
      showToast.success(t("settings:profileImage.uploaded"));
    } catch {
      showToast.error(t("settings:profileImage.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = () => {
    setIsRemoving(true);
    updateProfile({ imageUrl: null });
    updateStoredUser(profile.id, { imageUrl: null });
    showToast.success(t("settings:profileImage.removed"));
    setIsRemoving(false);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="group relative cursor-pointer size-32 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-32">
            {profile.imageUrl && (
              <AvatarImage src={profile.imageUrl} alt={fullName} />
            )}
            <AvatarFallback className="bg-muted">
              <UserIcon className="h-7 w-7 text-muted-foreground/60" />
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/40">
            <Camera className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="absolute bottom-0 end-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground text-background shadow-sm">
            <Pencil className="size-4" />
          </span>
        </button>
      </div>

      <ProfileImageModal
        open={showImageModal}
        onOpenChange={setShowImageModal}
        imageUrl={profile.imageUrl}
        alt={fullName}
        isUploading={isUploading}
        isRemoving={isRemoving}
        onFileSelect={handleFileSelect}
        onInvalidFileType={() =>
          showToast.error(t("settings:profileImage.invalidType"))
        }
        onRequestRemove={() => setShowDeleteConfirm(true)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t("settings:profileImage.deleteConfirmTitle")}
        description={t("settings:profileImage.deleteConfirmDescription")}
        confirmText={t("common:delete")}
        cancelText={t("common:cancel")}
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isRemoving}
        loadingText={t("common:removing")}
      />
    </>
  );
}
