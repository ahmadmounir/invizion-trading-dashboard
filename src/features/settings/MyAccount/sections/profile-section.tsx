import type { PublicUser } from "@/shared/types/user";
import { useState } from "react";
import { useProfileStore } from "@/shared/stores/profileStore";
import { updateStoredUser } from "@/shared/services/localAuth";
import { showToast } from "@/shared/components/ui/toast-config";
import { useI18n } from "@/shared/hooks/useI18n";
import {
  isValidTurkishMobile,
  fromTurkishPhoneNumber,
  toTurkishPhoneNumber,
} from "@/shared/utils/phone";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FormFieldWrapper,
  Input,
  Label,
  PhoneInput,
} from "@/shared/components/ui";

interface ProfileSectionProps {
  profile: PublicUser;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const { t } = useI18n();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: fromTurkishPhoneNumber(profile.phone),
  });

  const handleChange = () => {
    setIsEditing(true);
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: fromTurkishPhoneNumber(profile.phone),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: fromTurkishPhoneNumber(profile.phone),
    });
  };

  const handleUpdate = () => {
    if (formData.phone && !isValidTurkishMobile(formData.phone)) {
      showToast.error(t("validation.invalidTurkishMobile"));
      return;
    }

    const updates = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone ? toTurkishPhoneNumber(formData.phone) : "",
    };

    updateProfile(updates);
    updateStoredUser(profile.id, updates);
    setIsEditing(false);
    showToast.success(t("common:messages.profileUpdated"));
  };

  return (
    <>
      <div className="mb-3">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("settings:personalInformation")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("settings:personalInformationDescription")}
        </p>
      </div>
      <Card>
        <CardTitle className="sr-only"></CardTitle>
        <CardDescription className="sr-only"></CardDescription>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* First Name */}
            <FormFieldWrapper>
              <Label>{t("firstName")}</Label>
              {isEditing ? (
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="py-1">{profile.firstName}</div>
              )}
            </FormFieldWrapper>

            {/* Last Name */}
            <FormFieldWrapper>
              <Label>{t("lastName")}</Label>
              {isEditing ? (
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="py-1">{profile.lastName}</div>
              )}
            </FormFieldWrapper>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Email */}
            <FormFieldWrapper>
              <Label>{t("email")}</Label>
              {isEditing ? (
                <Input
                  dir="ltr"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="py-1" dir="ltr">
                  {profile.email}
                </div>
              )}
            </FormFieldWrapper>

            {/* Phone Number */}
            <FormFieldWrapper>
              <Label>{t("phoneNumber")}</Label>
              {isEditing ? (
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, phone: value }))
                  }
                  placeholder={t("placeholders.enterPhoneNumber")}
                />
              ) : (
                <div className="py-1">
                  {profile.phone
                    ? `+90 ${fromTurkishPhoneNumber(profile.phone)}`
                    : "-"}
                </div>
              )}
            </FormFieldWrapper>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={handleChange}>
                {t("edit")}
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={handleCancel}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleUpdate}>{t("saveChanges")}</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
