import { useRouter } from "next/router";

/**
 * @deprecated The method should not be used
 */
export const useActionPage = (): {
  get: any;
  currentUrl: any;
  pushResetUrl: any;
  pushWithParams: any;
} => {
  const router = useRouter();
  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();
  const listKeys = Array.from(params.keys());

  const pushWithParams = (requestParams?: any) => {
    const paramsString = requestParams ? requestParams.toString() : null;
    router.push({ pathname: leftPart, search: paramsString });
  };

  const get = (name: string) => {
    return params.get(name);
  };
  const pushResetUrl = (paramsList?: any) => {
    let actionParams = params;
    if (paramsList !== undefined || paramsList?.length) {
      listKeys.forEach((x: any) => {
        if (!paramsList.includes(x)) {
          actionParams.delete(x);
        }
      });
    } else {
      actionParams = new URLSearchParams();
    }
    pushWithParams(actionParams);
  };

  return {
    get,
    currentUrl: leftPart,
    pushResetUrl,
    pushWithParams: pushWithParams,
  };
};
