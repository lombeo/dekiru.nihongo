import { useRouter } from "next/router";
import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

export default class QueryUtils {
  static buildQueryString(obj: Record<string, any>): string {
    const queryObject = Object.entries(obj).reduce((a: { [key: string]: any }, [k, v]) => {
      if (v == null) {
        return a;
      } else if (typeof v === "string" && v.trim().length === 0) {
        return a;
      }
      a[k] = v;
      return a;
    }, {});
    return new URLSearchParams(queryObject).toString();
  }

  static sanitizeObj(obj?: Record<string, any>) {
    if (!obj) return obj;
    return Object.entries(obj).reduce((a: { [key: string]: any }, [k, v]) => {
      if (typeof v === "string" && v.trim().length > 0) {
        a[k] = this.sanitize(v);
      } else {
        a[k] = v;
      }
      return a;
    }, {});
  }

  static sanitize = (str: string | null | undefined) => {
    return DOMPurify.sanitize(str);
  };
}

export const useNextQueryParam = (key: string): string | undefined => {
  const { asPath } = useRouter();

  const value = useMemo(() => {
    const match = asPath.match(new RegExp(`[&?]${key}=(.*?)(&|$)`));
    if (!match) return undefined;
    return decodeURIComponent(match[1]);
  }, [asPath, key]);

  return value;
};
