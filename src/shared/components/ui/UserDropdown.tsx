import { useNavigate } from "react-router-dom";
import React from "react";
import { useI18n } from "@/shared/hooks/useI18n";
import { LogOut, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/Avatar";
import { LanguageSwitcher } from "@/shared/components/ui/LanguageSwitcher";
import { logout } from "@/features/auth/api/authApi";
import { useProfile } from "@/shared/stores/profileStore";
import type { Profile } from "@/shared/types/api";
import getInitials from "@/shared/utils/getInitials";

// Get user data from profile
function getUserData(profileData: Profile | null) {
  try {
    if (profileData) {
      return {
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        avatar: profileData.imageUrl || "",
        username: profileData.email,
        role: profileData.role,
        tenantName: profileData.tenantName,
      };
    }
  } catch (error) {
    console.error("Error parsing profile data:", error);
  }

  return {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    username: "john.doe",
    role: "Admin",
    tenantName: null,
  };
}

interface UserDropdownProps {
  children: React.ReactNode;
  align?: "start" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
}

export function UserDropdown({
  children,
  align = "start",
  side = "bottom",
  sideOffset = 10,
  className,
}: UserDropdownProps) {
  const navigate = useNavigate();
  const currentUser = useProfile();
  const user = getUserData(currentUser);
  const { t, i18n } = useI18n();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      handleNavigation("/auth/login");
    } catch (error) {
      // Still navigate even if API fails (token already cleared)
      console.error("Logout error:", error);
      handleNavigation("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        dir={i18n.dir()}
        className={`w-68 ${className} p-2`}
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user.avatar ? (
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-base">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate">{user.name}</p>
              <p className=" text-muted-foreground truncate font-normal">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Main Actions */}
        <DropdownMenuGroup className="space-y-1 py-1">
          <DropdownMenuItem
            className="py-2"
            onClick={() => handleNavigation("/settings")}
          >
            <Settings className={`h-5 w-5 me-2`} />
            {t("common:settings")}
          </DropdownMenuItem>
          <LanguageSwitcher mode="submenu" />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="py-2 mt-2"
        >
          <LogOut className={`h-5 w-5 me-2`} />
          {t("auth:logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
