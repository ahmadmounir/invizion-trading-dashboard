import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, DEMO_CREDENTIALS } from "@/shared/services/localAuth";
import { useProfileStore } from "@/shared/stores/profileStore";
import type { LocationState } from "@/features/auth/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Input,
} from "@/shared/components/ui";

// Define the form values type
interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { t, isRTL } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const setProfile = useProfileStore((s) => s.setProfile);

  // Define the form schema with translated messages
  const formSchema = z.object({
    email: z.string().min(1, { message: t("common:validation.required") }),
    password: z.string().min(1, { message: t("common:validation.required") }),
  });

  // Redirect to where the user was trying to go before being sent to login
  const from = state?.from?.pathname || "/";

  // Display success message if redirected from register page
  useEffect(() => {
    if (state?.successMessage) {
      showToast.success(state.successMessage);

      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const result = login(data.email, data.password);

      if (!result.success || !result.user) {
        throw new Error(result.message || "Failed to login");
      }

      setProfile(result.user);
      navigate(from, { replace: true });
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="bg-card">
        <CardHeader className="space-y-1">
          <CardTitle
            className={`text-xl font-bold text-center ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {t("auth:login")}
          </CardTitle>
          <CardDescription
            className={`text-center ${isRTL ? "font-arabic" : ""}`}
          >
            {t("auth:signInToAccount")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="font-semibold">
                        {t("email")}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={t("email")}
                        type="text"
                        autoComplete="username"
                        dir="ltr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      {t("password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("auth:passwordPlaceholder")}
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? t("common:loading") : t("auth:login")}
              </Button>

              <div className="text-center">
                <p>
                  {t("auth:dontHaveAccount")}{" "}
                  <Link
                    to="/auth/register"
                    className="text-primary underline underline-offset-4"
                  >
                    {t("auth:createAccount")}
                  </Link>
                </p>
              </div>

              <p className="text-center text-muted-foreground">
                {t("auth:demoCredentialsHint", {
                  email: DEMO_CREDENTIALS.email,
                  password: DEMO_CREDENTIALS.password,
                })}
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
