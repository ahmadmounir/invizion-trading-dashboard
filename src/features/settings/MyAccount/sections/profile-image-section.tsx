import { useState } from "react";
import { Camera, Pencil, User as UserIcon } from "lucide-react";
import type { Profile } from "@/shared/types/api";
import {
  uploadProfileImage,
  deleteProfileImage,
} from "@/shared/services/profileImageService";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import { useProfileStore } from "@/shared/stores/profileStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ConfirmDialog,
} from "@/shared/components/ui";
import { ProfileImageModal } from "../components/profile-image-modal";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface ProfileImageSectionProps {
  profile: Profile;
}

/**
 * Settings profile-image trigger. Clicking the avatar opens a modal where the
 * upload/remove operations happen; changes are applied immediately and synced
 * back into the Zustand profile store.
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
      const res = await uploadProfileImage(file);
      if (res.success && res.data) {
        updateProfile({ imageUrl: res.data.imageUrl || null });
        showToast.success(t("settings:profileImage.uploaded"));
      } else {
        showToast.error(res.message || t("settings:profileImage.uploadFailed"));
      }
    } catch {
      showToast.error(t("settings:profileImage.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsRemoving(true);
    try {
      const res = await deleteProfileImage();
      if (res.success) {
        updateProfile({ imageUrl: null });
        showToast.success(t("settings:profileImage.removed"));
        setShowDeleteConfirm(false);
      } else {
        showToast.error(res.message || t("settings:profileImage.removeFailed"));
      }
    } catch {
      showToast.error(t("settings:profileImage.removeFailed"));
    } finally {
      setIsRemoving(false);
    }
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
