import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { useI18n } from "@/shared/hooks";
import type { Session } from "@/shared/types/api";
import { formatDateTime } from "@/shared/utils";
import { Badge } from "@/shared/components/ui/Badge";

interface SessionDetailsModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionDetailsModal({
  session,
  isOpen,
  onClose,
}: SessionDetailsModalProps) {
  const { t } = useI18n();

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("settings:sessionDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Device */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:device")}</div>
            <div className="col-span-2">{session.device}</div>
          </div>

          {/* Operating System */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:operatingSystem")}</div>
            <div className="col-span-2 flex items-center gap-2">
              {session.os}
              {session.isCurrent && (
                <Badge variant="default" className="text-xs">
                  {t("settings:currentSession")}
                </Badge>
              )}
            </div>
          </div>

          {/* Browser */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:browser")}</div>
            <div className="col-span-2">{session.browser}</div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:location")}</div>
            <div className="col-span-2">
              {session.countryName} ({session.countryCode})
            </div>
          </div>

          {/* IP Address */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:ipAddress")}</div>
            <div className="col-span-2 break-all font-mono">
              {session.ipAddress}
            </div>
          </div>

          {/* Signed In */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:signedIn")}</div>
            <div className="col-span-2">
              {formatDateTime(session.createdOn)}
            </div>
          </div>

          {/* Expires */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:expires")}</div>
            <div className="col-span-2">
              {formatDateTime(session.expiresOn)}
            </div>
          </div>

          {/* MFA Verified */}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">{t("settings:mfaVerified")}</div>
            <div className="col-span-2">
              {session.mfaVerified ? t("common:yes") : t("common:no")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
