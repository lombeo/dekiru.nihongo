import { Notify } from "@src/components/cms";
import { IdentityService } from "@src/services/IdentityService";
import { TFunction } from "i18next";

export const handleResendChallengeEmail = async (
  userId: number, 
  t: TFunction, 
  refetch: () => void
) => {
  try {
    const response = await IdentityService.resendChallengeEmail({ userId });
    if (response?.data?.success) {
      Notify.success(t("Resend email successfully!"));
      refetch(); // Refresh the list after success
    } else {
      Notify.error(t(response?.data?.message || "Failed to resend email"));
    }
  } catch (error) {
    Notify.error(t("An error occurred while resending email"));
  }
};