import QueryUtils from "@src/helpers/query-utils";
import { isNil } from "lodash";
import { NextRouter, useRouter as useNextRouter } from "next/router";
import { useMemo } from "react";
import { UrlObject } from "url";

const convertUrl = (url?: string | UrlObject): string | UrlObject => {
  if (isNil(url) || typeof url === "string" || isNil(url.query) || typeof url.query === "string") return url;
  return {
    ...url,
    query: QueryUtils.sanitizeObj(url.query),
  };
};

/**
 * @deprecated The method should not be used
 */
export const useRouter = () => {
  const router = useNextRouter();
  return useMemo<NextRouter>(
    () => ({
      ...router,
      push: (url: any, as?: any, options?: any): Promise<boolean> =>
        router.push(convertUrl(url), convertUrl(as), options),
    }),
    [router]
  );
};
