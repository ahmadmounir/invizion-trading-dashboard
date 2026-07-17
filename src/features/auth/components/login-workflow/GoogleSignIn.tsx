import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { externalLogin, resolveAuthChallenge } from "@/features/auth/api/authApi";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import type { LocationState } from "@/shared/types/api";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
    <path
      fill="#4285F4"
      d="M17.64 9.204c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.181l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.709A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.709V4.959H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.041l3.007-2.332z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.959L3.964 7.291C4.672 5.164 6.656 3.58 9 3.58z"
    />
  </svg>
);

const GoogleSignIn = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/";

  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(380);

  useEffect(() => {
    if (containerRef.current) {
      setButtonWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showToast.error(t("auth:google.failed"));
      return;
    }

    try {
      const result = await externalLogin(
        "google",
        credentialResponse.credential,
      );

      if (!result.success || !result.data) {
        throw new Error(result.message || t("auth:google.failed"));
      }

      const outcome = await resolveAuthChallenge(result.data);

      if (outcome.status === "access") {
        // Profile + onboarding are already hydrated by resolveAuthChallenge.
        navigate(from, { replace: true });
      } else {
        navigate(outcome.path, {
          replace: true,
          state: { otpSentTo: outcome.otpSentTo },
        });
      }
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : t("auth:google.failed"),
      );
    }
  };

  const handleError = () => {
    showToast.error(t("auth:google.failed"));
  };

  return (
    <div ref={containerRef} className="relative h-11 w-full rounded">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex w-full items-center justify-center gap-3 rounded border border-[#dadce0] bg-white text-[#3c4043] transition-colors hover:bg-[#f8f9fa] dark:border-[#8e918f] dark:bg-[#131314] dark:text-[#e3e3e3] dark:hover:bg-[#1e1f20]"
      >
        <GoogleIcon />
        <span className="font-medium">{t("auth:google.signInButton")}</span>
      </button>

      {/* Transparent, stacked on top so it captures the real click while our button provides the visuals */}
      <div className="absolute inset-0 overflow-hidden opacity-0">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text="signin_with"
          shape="rectangular"
          theme="outline"
          size="large"
          logo_alignment="center"
          width={buttonWidth}
        />
      </div>
    </div>
  );
};

export default GoogleSignIn;
