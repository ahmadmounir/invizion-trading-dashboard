import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyMfa, resolveAuthChallenge } from "@/features/auth/api/authApi";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import type { LocationState } from "@/shared/types/api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  OtpInput,
} from "@/shared/components/ui";
import { Smartphone, Loader2 } from "lucide-react";

const MfaVerification = () => {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const otpSentTo = state?.otpSentTo;

  const description =
    otpSentTo && otpSentTo.length > 0
      ? t("auth:mfa.descriptionWithDestination", {
          destinations: otpSentTo.join(", "),
        })
      : t("auth:mfa.description");

  // Check if user has a token
  useEffect(() => {
    const token = localStorage.getItem("inviziontenantui-token");

    if (!token) {
      showToast.error(t("auth:mfa.noToken"));
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, t]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (code.length !== 6) {
      showToast.error(t("auth:mfa.invalidCodeLength"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyMfa(code);

      if (!response.success || !response.data) {
        throw new Error(response.message || t("auth:mfa.verificationFailed"));
      }

      const outcome = await resolveAuthChallenge(response.data);

      // If we got an access token, proceed to dashboard. Profile + onboarding
      // are already hydrated by resolveAuthChallenge.
      if (outcome.status === "access") {
        navigate(outcome.path, { replace: true });
      }
      // If there's another challenge step, navigate to it
      else {
        showToast.info(t("auth:mfa.anotherStepRequired"));
        navigate(outcome.path, {
          replace: true,
          state: { otpSentTo: outcome.otpSentTo },
        });
      }
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : t("auth:mfa.verificationFailed"),
      );
      setCode(""); // Clear the code on error
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6 && !isLoading) {
      handleSubmit();
    }
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = () => {
    // Clear auth token and return to login
    localStorage.removeItem("inviziontenantui-token");
    navigate("/auth/login", { replace: true });
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="py-10">
          <div className="mx-auto flex h-25 w-25 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Smartphone className="h-12 w-12 text-primary" />
          </div>

          <CardTitle className="text-2xl font-bold text-center">
            {t("auth:mfa.title")}
          </CardTitle>

          <CardDescription className="text-center mx-auto">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="flex justify-center">
              <OtpInput
                length={6}
                value={code}
                onChange={setCode}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-center gap-2">
              <Button type="submit" disabled={isLoading || code.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common:submitting")}
                  </>
                ) : (
                  t("submit")
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

export default MfaVerification;
