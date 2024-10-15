import { COOKIES_NAME, LOCAL_STORAGE } from "@src/constants/common.constant";
import { selectRoles } from "@src/store/slices/authSlice";
import { useSelector } from "react-redux";
import { removeCookie } from "./cookies.helper";

export const logout = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(LOCAL_STORAGE.TOKEN);
  localStorage.removeItem(LOCAL_STORAGE.CHAT_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE.CART_ITEMS);
  localStorage.removeItem(LOCAL_STORAGE.FIRST_TIME_LOAD_EVENT);
  removeCookie(COOKIES_NAME.ORDER_INFO);
};
export function hasAnyRole(userRoles: string[], rolesToCheck: string[] | null | undefined) {
  if (!rolesToCheck || rolesToCheck.length <= 0) return true;
  if (!userRoles || userRoles.length <= 0) return false;
  return !!userRoles.some((role) => rolesToCheck.includes(role));
}

export function hasEveryRole(userRoles: string[], rolesToCheck: string[] | null | undefined) {
  if (!rolesToCheck || rolesToCheck.length <= 0) return true;
  if (!userRoles || userRoles.length <= 0) return false;
  return !!rolesToCheck.every((role) => userRoles.includes(role));
}

export const useHasAnyRole = (rolesToCheck: string[] | null | undefined) => {
  const userRoles = useSelector(selectRoles);
  return hasAnyRole(userRoles, rolesToCheck);
};

export const useHasEveryRole = (rolesToCheck: string[] | null | undefined) => {
  const userRoles = useSelector(selectRoles);
  return hasEveryRole(userRoles, rolesToCheck);
};

/**
 * @deprecated The method should not be used
 */
export const getCurrentLang = (data: any, locale: string, key = "multiLang") => {
  if (!data || !data[key]) return null;
  const keyLocale = locale === "vi" ? "vn" : "en";
  return data[key].find((e) => e.languageKey === keyLocale || e.key === keyLocale);
};

export const resolveLanguage = (data: any, locale: string, key = "multiLangData") => {
  if (!data || !data[key]) return null;
  const keyLocale = locale === "vi" ? "vn" : "en";
  return data[key]?.find((e) => e.languageKey === keyLocale || e.key === keyLocale) || data[key]?.[0];
};
