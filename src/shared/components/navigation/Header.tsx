import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import {
  UserDropdown,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui";
import { useProfile } from "@/shared/stores/profileStore";
import { useI18n } from "@/shared/hooks/useI18n";
import type { Profile } from "@/shared/types/api";
import getInitials from "@/shared/utils/getInitials";

// Navigation links configuration
const navLinks = [
  { name: "home", href: "/", nameKey: "common:home", exact: true },
  { name: "settings", href: "/settings", nameKey: "common:settings" },
];

// Get user data from profile
function getUserData(profileData: Profile | null) {
  if (profileData) {
    return {
      name: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      avatar: profileData.imageUrl || "",
    };
  }

  return {
    name: "-",
    email: "-",
    avatar: "",
  };
}

export function Header() {
  const { t } = useI18n();
  const location = useLocation();
  const profile = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = getUserData(profile);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-medium hover:opacity-90 transition-opacity"
        >
          <div className="h-full" style={{ width: "50px" }}>
            <img
              className="h-full w-full dark:hidden"
              src="/assets/images/invizion_logo.png"
              alt="Invizion logo"
            />
            <img
              className="hidden h-full w-full dark:block"
              src="/assets/images/invizion_logo.png"
              alt="Invizion logo"
            />
          </div>
        </Link>

        {/* Navigation Links - Center */}
        <nav className="hidden items-center gap-1 md:flex md:gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "px-3 py-2 font-medium transition-colors rounded-md",
                isActive(link.href, link.exact)
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {t(link.nameKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile Navigation Menu */}
          <button
            type="button"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label={t("common:menu")}
            aria-controls="mobile-nav-links"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">{t("common:menu")}</span>
          </button>

          {/* User Menu */}
          <UserDropdown align="end">
            <button className="flex items-center gap-2 rounded-full hover:opacity-90 transition-opacity">
              <Avatar className="size-10 cursor-pointer">
                {user.avatar ? (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </UserDropdown>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          id="mobile-nav-links"
          className={cn(
            "overflow-hidden border-t transition-all duration-300 ease-out md:hidden",
            isMobileMenuOpen
              ? "max-h-80 pb-4 pt-3 opacity-100"
              : "max-h-0 pb-0 pt-0 opacity-0",
          )}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 font-medium transition-colors",
                  isActive(link.href, link.exact)
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {t(link.nameKey)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
