import { Notify } from "@src/components/cms";
import { IdentityService } from "@src/services/IdentityService";
import { TFunction } from "i18next";

export const handleSetVerifiedEmail = async (
  userId: number, 
  t: TFunction, 
  refetch: () => void
) => {
  try {
    const response = await IdentityService.setVerifiedUserEmail({ userId });
    if (response?.data?.success) {
      Notify.success(t("Email verified successfully!"));
      refetch(); // Refresh the list after success
    } else {
      Notify.error(t(response?.data?.message || "Failed to verify email"));
    }
  } catch (error) {
    Notify.error(t("An error occurred while verifying email"));
  }
};