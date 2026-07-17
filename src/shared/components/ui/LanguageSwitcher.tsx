import { Languages, Check } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/shared/hooks/useI18n";
import { updateProfileLanguage } from "@/shared/services/profileService";
import { showToast } from "@/shared/components/ui/toast-config";
import { useProfile, useProfileStore } from "@/shared/stores/profileStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";

interface LanguageSwitcherProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  align?: "start" | "end" | "center";
  mode?: "dropdown" | "submenu" | "select";
  className?: string;
}

export function LanguageSwitcher({
  align = "end",
  mode = "dropdown",
  className,
}: LanguageSwitcherProps) {
  const { t, i18n } = useI18n();
  const profile = useProfile();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  const handleLanguageChange = async (language: string) => {
    // Always update localStorage via i18n
    i18n.changeLanguage(language);

    // Check if user is authenticated (has token)
    const token = localStorage.getItem("inviziontenantui-token");
    if (token && profile) {
      setIsUpdatingLanguage(true);
      try {
        const response = await updateProfileLanguage(language);
        if (response.success) {
          // Update profile store with new language
          updateProfile({ language });
          showToast.success(t("settings:preferences.languageUpdated"));
        } else {
          showToast.error(
            response.message || t("settings:preferences.languageUpdateFailed"),
          );
        }
      } catch {
        showToast.error(t("settings:preferences.languageUpdateFailed"));
      } finally {
        setIsUpdatingLanguage(false);
      }
    }
  };

  // Select mode — a plain select/combobox with no search, for use in forms/settings
  if (mode === "select") {
    return (
      <Select
        value={i18n.language}
        onValueChange={handleLanguageChange}
        disabled={isUpdatingLanguage}
      >
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tr">{t("common:languages.tr")}</SelectItem>
          <SelectItem value="en">{t("common:languages.en")}</SelectItem>
          <SelectItem value="ar">{t("common:languages.ar")}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Submenu mode for use inside another dropdown menu
  if (mode === "submenu") {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="py-2" disabled={isUpdatingLanguage}>
          <Languages className={`h-5 w-5 me-2`} />
          {t("common:language")}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            onClick={() => handleLanguageChange("tr")}
            disabled={isUpdatingLanguage}
          >
            <div className="flex items-center justify-between w-full">
              <span>{t("common:languages.tr")}</span>
              {i18n.language === "tr" && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLanguageChange("en")}
            disabled={isUpdatingLanguage}
          >
            <div className="flex items-center justify-between w-full">
              <span>{t("common:languages.en")}</span>
              {i18n.language === "en" && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLanguageChange("ar")}
            disabled={isUpdatingLanguage}
          >
            <div className="flex items-center justify-between w-full">
              <span>{t("common:languages.ar")}</span>
              {i18n.language === "ar" && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  // Default dropdown mode
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="cursor-pointer p-2 rounded-md bg-muted transition-colors outline-0"
          disabled={isUpdatingLanguage}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t("common:language")}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("tr")}
          className="flex items-center justify-between cursor-pointer"
          disabled={isUpdatingLanguage}
        >
          <span>{t("common:languages.tr")}</span>
          {i18n.language === "tr" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className="flex items-center justify-between cursor-pointer"
          disabled={isUpdatingLanguage}
        >
          <span>{t("common:languages.en")}</span>
          {i18n.language === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("ar")}
          className="flex items-center justify-between cursor-pointer"
          disabled={isUpdatingLanguage}
        >
          <span>{t("common:languages.ar")}</span>
          {i18n.language === "ar" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
