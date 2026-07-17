import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/shared/hooks/useI18n";
import { getSessions } from "@/shared/services/profileService";
import { logoutAll } from "@/features/auth/api/authApi";
import type { Session } from "@/shared/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/Table";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { DataError } from "@/shared/components/ui/DataError";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Badge } from "@/shared/components/ui/Badge";
import { showToast } from "@/shared/components/ui/toast-config";
import { Monitor, Info } from "lucide-react";
import SessionDetailsModal from "./components/SessionDetailsModal";

export default function Security() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await getSessions();
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(true);
        showToast.error(
          response.message || t("settings:errors.couldntLoadData"),
        );
      }
    } catch {
      setError(true);
      showToast.error(t("settings:errors.couldntLoadData"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      const response = await logoutAll();
      if (response.success) {
        navigate("/auth/login");
      } else {
        showToast.error(response.message || t("auth:logoutFailed"));
      }
    } catch {
      showToast.error(t("auth:logoutFailed"));
    } finally {
      setIsLoggingOut(false);
      setShowLogoutAllDialog(false);
    }
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("settings:activeSessions")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("settings:activeSessionsDescription")}
          </p>
        </div>
        {!error && sessions.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setShowLogoutAllDialog(true)}
            disabled={isLoading}
          >
            {t("settings:logoutAllSessions")}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6">
        {error ? (
          <DataError
            title={t("settings:errors.couldntLoadData")}
            message={t("settings:errors.couldntLoadData")}
            retryText={t("common:retry")}
            onRetry={loadSessions}
          />
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="ps-6 py-3 font-medium">
                      {t("settings:device")}
                    </TableHead>
                    <TableHead className="px-6 py-3 font-medium">
                      {t("settings:browser")}
                    </TableHead>
                    <TableHead className="px-6 py-3 font-medium">
                      {t("settings:location")}
                    </TableHead>
                    <TableHead className="pe-6 py-3 font-medium text-center">
                      {t("common:actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Skeleton rows
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell className="ps-6 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-[120px]" />
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <Skeleton className="h-4 w-[140px]" />
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="pe-6 py-3 text-center">
                          <Skeleton className="h-8 w-8 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : sessions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-muted-foreground"
                      >
                        {t("settings:noActiveSessions")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="ps-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted`}>
                              <Monitor className={`h-5 w-5  ${session.isCurrent ? "text-emerald-600" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 text-nowrap">
                                <span className="font-medium">
                                  {session.os}
                                </span>
                                {session.isCurrent && (
                                  <Badge variant="success" className="text-xs rounded-full">
                                    {t("settings:currentSession")}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {session.device}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span>{session.browser}</span>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span>
                            {session.countryName} ({session.countryCode})
                          </span>
                        </TableCell>
                        <TableCell className="pe-6 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(session)}
                            className="h-8 w-8"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Logout All Sessions Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutAllDialog}
        onOpenChange={setShowLogoutAllDialog}
        title={t("settings:logoutAllSessionsConfirmTitle")}
        description={t("settings:logoutAllSessionsConfirmDescription")}
        confirmText={t("settings:logoutAllSessions")}
        cancelText={t("common:cancel")}
        onConfirm={handleLogoutAll}
        variant="destructive"
        isLoading={isLoggingOut}
        loadingText={t("common:processing")}
      />

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
}
