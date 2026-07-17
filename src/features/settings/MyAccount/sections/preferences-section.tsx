import { Languages, Palette } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Label,
  LanguageSwitcher,
} from "@/shared/components/ui";
import { ThemeSwitcher } from "@/shared/components/theme/ThemeSwitcher";

export function PreferencesSection() {
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("settings:preferences.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("settings:preferences.description")}
        </p>
      </div>
      <Card>
        <CardTitle className="sr-only"></CardTitle>
        <CardDescription></CardDescription>
        <CardContent className="space-y-6 pt-6">
          {/* Language Selection */}
          <div className="space-y-4 w-full sm:w-[300px]">
            <Label className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              {t("settings:preferences.language")}
            </Label>
            <LanguageSwitcher mode="select" className="w-full" />
          </div>

          {/* Theme Selection */}
          <div className="space-y-4 w-full sm:w-[300px]">
            <Label className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t("settings:preferences.theme")}
            </Label>
            <ThemeSwitcher size="sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
