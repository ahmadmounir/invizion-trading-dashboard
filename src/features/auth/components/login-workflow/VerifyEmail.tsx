import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  verifyEmailBegin,
  verifyEmail,
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
  FormFieldWrapper,
  Input,
} from "@/shared/components/ui";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // Get query params
  const codeFromUrl = searchParams.get("code");
  const emailFromUrl = searchParams.get("email");

  const [sentToEmail, setSentToEmail] = useState<string | null>(emailFromUrl);

  const loadSentToEmail = async () => {
    const response = await getProfile();
    if (response.success && response.data?.email) {
      setSentToEmail(response.data.email);
    }
  };

  // Check if user has a challenge token
  useEffect(() => {
    // Prevent running multiple times
    if (hasInitialized.current) return;

    const token = localStorage.getItem("inviziontenantui-token");

    if (!token) {
      showToast.error(t("auth:verifyEmail2.noToken"));
      navigate("/auth/login", { replace: true });
      return;
    }

    void loadSentToEmail();

    // Scenario 2: User clicked link with code in URL
    if (codeFromUrl) {
      hasInitialized.current = true;
      handleVerifyCode(codeFromUrl);
    }
    // Scenario 1: No code in URL, send email (only after searchParams have been checked)
    else if (!codeFromUrl) {
      hasInitialized.current = true;
      handleBeginVerification();
    }
  }, [codeFromUrl, emailFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBeginVerification = async () => {
    setIsLoading(true);

    try {
      const response = await verifyEmailBegin();

      if (!response.success) {
        throw new Error(
          response.message || t("auth:verifyEmail2.sendEmailFailed"),
        );
      }

      showToast.success(t("auth:verifyEmail2.emailSent"));
    } catch (err) {
      showToast.error(
        err instanceof Error
          ? err.message
          : t("auth:verifyEmail2.sendEmailFailed"),
      );
      navigate("/auth/login", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    setIsLoading(true);

    try {
      const response = await verifyEmail(verificationCode);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || t("auth:verifyEmail2.verificationFailed"),
        );
      }

      const outcome = await resolveAuthChallenge(response.data);

      // If we got an access token, proceed to dashboard. Profile + onboarding
      // are already hydrated by resolveAuthChallenge.
      if (outcome.status === "access") {
        showToast.success(t("auth:verifyEmail2.verificationSuccess"));
        navigate(outcome.path, { replace: true });
      }
      // If there's another challenge step, navigate to it
      else {
        showToast.info(t("auth:verifyEmail2.anotherStepRequired"));
        navigate(outcome.path, {
          replace: true,
          state: { otpSentTo: outcome.otpSentTo },
        });
      }
    } catch (err) {
      showToast.error(
        err instanceof Error
          ? err.message
          : t("auth:verifyEmail2.verificationFailed"),
      );
      setCode(""); // Clear the code on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      showToast.error(t("auth:verifyEmail2.codeRequired"));
      return;
    }

    await handleVerifyCode(code);
  };

  const handleCancel = () => {
    // Clear auth token and return to login
    localStorage.removeItem("inviziontenantui-token");
    navigate("/auth/login", { replace: true });
  };

  // Show loading state while auto-verifying with URL code
  if (codeFromUrl && isLoading) {
    return (
      <AuthLayout>
        <Card>
          <CardContent className="py-20 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("auth:verifyEmail2.verifying")}
            </p>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth:verifyEmail2.title")}
          </CardTitle>

          <CardDescription className="text-center mx-auto">
            {t("auth:verifyEmail2.description")}:
            <br />
            <span className="font-semibold">{sentToEmail}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormFieldWrapper>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("auth:verifyEmail2.codePlaceholder")}
                disabled={isLoading}
              />
            </FormFieldWrapper>

            <div className="flex justify-center gap-2">
              <Button type="submit" disabled={isLoading || !code.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t("common:submitting")}
                  </>
                ) : (
                  t("common:verify")
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
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

export default VerifyEmail;
