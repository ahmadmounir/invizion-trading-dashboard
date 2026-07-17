import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setMobile } from "@/features/auth/api/authApi";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormFieldWrapper,
  PhoneInput,
} from "@/shared/components/ui";
import { Loader2, Smartphone } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TURKISH_MOBILE_REGEX, toTurkishPhoneNumber } from "@/shared/utils/phone";

const SetMobile = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("inviziontenantui-token");
    if (!token) {
      showToast.error(t("auth:setMobile.noToken"));
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, t]);

  const formSchema = z.object({
    mobileNumber: z
      .string()
      .min(1, { message: t("common:validation.required") })
      .regex(TURKISH_MOBILE_REGEX, {
        message: t("auth:setMobile.invalidPhone"),
      }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { mobileNumber: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await setMobile(toTurkishPhoneNumber(data.mobileNumber));

      if (!response.success) {
        throw new Error(response.message || t("auth:setMobile.submitFailed"));
      }

      showToast.success(t("auth:setMobile.success"));
      navigate("/auth/verify-mobile", { replace: true });
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : t("auth:setMobile.submitFailed"),
      );
    }
  };

  const handleCancel = () => {
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
            {t("auth:setMobile.title")}
          </CardTitle>

          <CardDescription className="text-center mx-auto">
            {t("auth:setMobile.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormFieldWrapper>
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        {t("auth:setMobile.mobileLabel")}
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={t("auth:setMobile.mobilePlaceholder")}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormFieldWrapper>

              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="me-2 h-4 w-4 animate-spin" />
                      {t("common:submitting")}
                    </>
                  ) : (
                    t("auth:setMobile.submit")
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
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default SetMobile;
