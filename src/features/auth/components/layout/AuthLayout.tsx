import { Link } from "react-router-dom";
import { AuthHeader } from "@/features/auth/components/layout/AuthHeader";
import { useI18n } from "@/shared/hooks/useI18n";
import { LanguageSwitcher } from "@/shared/components/ui/LanguageSwitcher";

interface AuthLayoutProps {
  children: React.ReactNode;
  showPendingInvitation?: boolean;
}

// AuthLayout.tsx
export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useI18n();
  const color = localStorage.getItem("inviziontenantui-theme") == "dark" ? "white" : "black";

  return (
    <div className="grid min-h-screen w-full lg:h-screen lg:grid-cols-2">
      {/* Branding panel — desktop only */}
      <div className="relative hidden flex-col bg-accent/75 overflow-hidden p-12 lg:flex ">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              `radial-gradient(circle at 1px 1px, ${color} 2px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 self-end">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <Link
            to="/auth/login"
            className="flex items-center gap-3"
            dir="ltr"
          >
            <img
              src="/assets/images/invizion_logo.png"
              alt={t("auth:brand.name")}
              className="h-full"
              style={{ width: "70px" }}
            />
            <span className="text-5xl font-bold text-foreground uppercase">
              invizion
            </span>
          </Link>

          <div className="mt-8 max-w-md">
            <h2 className="text-2xl font-bold text-foreground">
              {t("auth:brand.title")}
            </h2>
          </div>
        </div>

        <p className="relative z-10 self-start w-full text-center text-muted-foreground">
          {t("auth:brand.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>

      {/* Form panel */}
      <div className="h-screen overflow-y-auto lg:h-full">
        <div className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8">
          <div className="lg:hidden">
            <AuthHeader>
              <LanguageSwitcher />
            </AuthHeader>
          </div>
          <div className="mt-8 w-full max-w-[440px] lg:mt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
