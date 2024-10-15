import { Notify } from "@edn/components/Notify/AppNotification";
import { validateUsername } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { CommentContextType } from "@src/services/CommentService/types";
import { setOpenModalChangeUsername } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useRegisterContest = (
  isTeam: boolean,
  contestId: number,
  onOpenRegisterTeamModal: () => void,
  onSuccess: () => void,
  title?: string
) => {
  const router = useRouter();
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const onRegister = async () => {
    if (profile && profile.userName && validateUsername(profile.userName)) {
      dispatch(setOpenModalChangeUsername(true));
      return;
    }

    if (isTeam) {
      onOpenRegisterTeamModal();
      return;
    }

    const resCheckLevel = await CodingService.contestRegisterCheckUserLevel({
      contestId: contestId,
      userIdOrTeamId: profile?.userId,
    });

    if (resCheckLevel?.data?.message) {
      Notify.error(t(resCheckLevel.data.message));
      return;
    }

    setIsLoading(true);
    const resRegister = await CodingService.contestRegisterRegister({
      contestId: contestId,
      userIdOrTeamId: profile?.userId,
    });
    if (resRegister?.data?.success) {
      const orderId = resRegister.data.data.orderId;
      if (orderId) {
        router.push(`/payment/orders/checkout?orderId=${orderId}&contextType=${CommentContextType.Contest}`);
      } else {
        Notify.success(t("You/Your team have/has registered this batch successfully."));
        onSuccess();
      }
    } else if (resRegister?.data?.message) {
      Notify.error(t(resRegister.data.message));
    }
    setIsLoading(false);
  };

  return { onRegister, isLoading };
};

export default useRegisterContest;
