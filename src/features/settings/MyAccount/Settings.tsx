import {
  ProfileSection,
  ProfileImageSection,
  PreferencesSection,
} from "@/features/settings/MyAccount/sections";
import { useProfile } from "@/shared/stores/profileStore";
import { DataError } from "@/shared/components/ui";
import { useI18n } from "@/shared/hooks/useI18n";

export default function SettingsPage() {
  const { t } = useI18n();
  const profile = useProfile();

  if (!profile) {
    return (
      <DataError
        title={t("settings:errors.couldntLoadData")}
        message={t("settings:errors.unableToLoadProfile")}
        retryText={t("common:refresh")}
      />
    );
  }

  return (
    <div className=" w-full justify-center flex">
      <div className="max-w-4xl w-full space-y-6 ">
        {/* Profile Image Section */}
        <ProfileImageSection profile={profile} />

        {/* Profile Information Section */}
        <ProfileSection profile={profile} />

        {/* Preferences Section */}
        <PreferencesSection />
      </div>
    </div>
  );
}
