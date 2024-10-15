import { Notify } from "@edn/components/Notify/AppNotification";
import { LOCAL_STORAGE } from "@src/constants/common.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useLogin = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const returnUrl = useNextQueryParam("returnUrl");

  return async (data: any, token?: string) => {
    const res = await IdentityService.authenticationLogon(data, token);
    if (res?.data?.success) {
      const token = res.data.data;
      localStorage.setItem(LOCAL_STORAGE.TOKEN, token);
      if (router.pathname === "/") {
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          window.location.href = "/home";
        }
      } else if (["/forgot-password", "/reset-password", "/verify-email"].includes(router.pathname)) {
        window.location.href = "/home";
      } else {
        window.location.reload();
      }
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };
};

export default useLogin;
