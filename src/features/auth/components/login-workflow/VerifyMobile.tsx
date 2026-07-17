import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyMobile,
  verifyMobileBegin,
  resolveAuthChallenge,
} from "@/features/auth/api/authApi";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import { getProfile } from "../../api/authApi";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  OtpInput,
} from "@/shared/components/ui";
import { Loader2, Smartphone } from "lucide-react";

const OTP_LENGTH = 6;

const VerifyMobile = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [sentToPhone, setSentToPhone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const hasInitialized = useRef(false);

  const loadSentToPhone = async () => {
    const response = await getProfile();
    if (response.success && response.data) {
      setSentToPhone(response.data.phone);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;

    const token = localStorage.getItem("inviziontenantui-token");

    if (!token) {
      showToast.error(t("auth:verifyMobile.noToken"));
      navigate("/auth/login", { replace: true });
      return;
    }

    hasInitialized.current = true;
    void loadSentToPhone();
    void handleBeginVerification(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, t]);

  const handleBeginVerification = async (redirectOnError: boolean) => {
    setIsResending(true);

    try {
      const response = await verifyMobileBegin();

      if (!response.success) {
        throw new Error(
          response.message || t("auth:verifyMobile.sendCodeFailed"),
        );
      }

      showToast.success(t("auth:verifyMobile.codeSent"));
    } catch (err) {
      showToast.error(
        err instanceof Error
          ? err.message
          : t("auth:verifyMobile.sendCodeFailed"),
      );

      if (redirectOnError) {
        navigate("/auth/login", { replace: true });
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (code.length !== OTP_LENGTH) {
      showToast.error(t("auth:verifyMobile.invalidCodeLength"));
      return;
    }

    setIsVerifying(true);

    try {
      const response = await verifyMobile(code);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || t("auth:verifyMobile.verificationFailed"),
        );
      }

      const outcome = await resolveAuthChallenge(response.data);

      // Profile + onboarding are already hydrated by resolveAuthChallenge.
      if (outcome.status === "access") {
        showToast.success(t("auth:verifyMobile.verificationSuccess"));
        navigate(outcome.path, { replace: true });
        return;
      }

      showToast.info(t("auth:verifyMobile.anotherStepRequired"));
      navigate(outcome.path, {
        replace: true,
        state: { otpSentTo: outcome.otpSentTo },
      });
    } catch (err) {
      showToast.error(
        err instanceof Error
          ? err.message
          : t("auth:verifyMobile.verificationFailed"),
      );
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (code.length === OTP_LENGTH && !isVerifying && !isResending) {
      void handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleCancel = () => {
    localStorage.removeItem("inviziontenantui-token");
    navigate("/auth/login", { replace: true });
  };

  const handleResend = async () => {
    await handleBeginVerification(false);
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="py-10">
          <div className="mx-auto flex h-25 w-25 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Smartphone className="h-12 w-12 text-primary" />
          </div>

          <CardTitle className="text-2xl font-bold text-center">
            {t("auth:verifyMobile.title")}
          </CardTitle>

          <CardDescription className="text-center mx-auto">
            {t("auth:verifyMobile.description")}:
            <br />
            <span className="font-semibold">{sentToPhone}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="flex justify-center">
              <OtpInput
                length={OTP_LENGTH}
                value={code}
                onChange={setCode}
                disabled={isVerifying || isResending}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isVerifying || isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t("common:sending")}
                  </>
                ) : (
                  t("auth:verifyMobile.resendCode")
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isVerifying || isResending}
              >
                {t("common:cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default VerifyMobile;
