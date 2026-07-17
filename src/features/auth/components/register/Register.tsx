import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/features/auth/api/authApi.ts";
import { getIpGeolocation } from "@/shared/services/ipService";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  PasswordStrength,
  PhoneInput,
} from "@/shared/components/ui";
import GoogleSignIn from "../login-workflow/GoogleSignIn";
import {
  TURKISH_MOBILE_REGEX,
  toTurkishPhoneNumber,
} from "@/shared/utils/phone";

const Register = () => {
  const { t } = useI18n();

  // Define the form schema with Zod
  const formSchema = z
    .object({
      firstName: z.string().min(2, {
        message: t("common:validation.firstNameMin"),
      }),
      lastName: z.string().min(2, {
        message: t("common:validation.lastNameMin"),
      }),
      email: z.string().email({ message: t("common:validation.emailInvalid") }),
      phone: z
        .string()
        .optional()
        .refine((value) => !value || TURKISH_MOBILE_REGEX.test(value), {
          message: t("common:validation.invalidTurkishMobile"),
        }),
      password: z
        .string()
        .min(8, { message: t("common:validation.passwordMin") })
        .regex(/[A-Z]/, { message: t("common:validation.passwordUppercase") })
        .regex(/[a-z]/, { message: t("common:validation.passwordLowercase") })
        .regex(/[0-9]/, { message: t("common:validation.passwordNumber") })
        .regex(/[^A-Za-z0-9]/, {
          message: t("common:validation.passwordSpecial"),
        }),
      confirmPassword: z.string().min(8, {
        message: t("common:validation.passwordMin"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("common:validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

  // Define the form values type
  type FormValues = z.infer<typeof formSchema>;
  const [isLoading, setIsLoading] = useState(false);
  const [timezone, setTimezone] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch timezone from IP API
  useEffect(() => {
    const fetchTimezone = async () => {
      try {
        const response = await getIpGeolocation();

        if (response.success && response.data && response.data.timezone) {
          setTimezone(response.data.timezone);
        } else {
          const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTimezone(fallback);
        }
      } catch (error) {
        console.error("Error fetching timezone:", error);
        const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(fallback);
      }
    };

    fetchTimezone();
  }, []);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Adapt the data to match what the API expects
      const response = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: "",
        password: data.password,
        phone: data.phone ? toTurkishPhoneNumber(data.phone) : "",
        timezoneId: timezone,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to register");
      }

      // Show success toast
      showToast.success(t("auth:registrationSuccess"));

      // Redirect to login page
      navigate("/auth/login");
    } catch (err) {
      console.error("Registration error:", err);
      showToast.error(
        err instanceof Error ? err.message : t("auth:registrationFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">
              {t("auth:createAccount")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground ">
              {t("auth:createAccountDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required font-semibold">
                          {t("common:firstName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("auth:firstNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required font-semibold">
                          {t("common:lastName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("auth:lastNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required font-semibold">
                        {t("common:email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder={t("auth:emailPlaceholder")}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        {t("common:phoneNumber")}
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={t("auth:phonePlaceholder")}
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
                      <FormLabel className="required font-semibold">
                        {t("common:password")}
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder={t("auth:passwordPlaceholder")}
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute end-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                      </div>
                      <div className="mt-2">
                        <PasswordStrength password={field.value} />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {t("auth:passwordRequirements")}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required font-semibold">
                        {t("common:confirmPassword")}
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder={t("auth:confirmPasswordPlaceholder")}
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute end-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading
                    ? t("auth:creatingAccount")
                    : t("auth:createAccount")}
                </Button>

                <div className="text-center">
                  <p>
                    {t("auth:alreadyHaveAccount")}{" "}
                    <Link
                      to="/auth/login"
                      className="text-primary underline underline-offset-4"
                    >
                      {t("auth:login")}
                    </Link>
                  </p>
                </div>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-muted-foreground shrink-0">
                    {t("auth:orContinueWith")}
                  </span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <GoogleSignIn />
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center">
          {t("auth:agreementText")}{" "}
          <a href="#" className="font-bold">
            {t("auth:termsOfService")}
          </a>{" "}
          {t("auth:and")}{" "}
          <a href="#" className="font-bold">
            {t("auth:privacyPolicy")}
          </a>
          .
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
