import React, { useEffect } from "react";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { OauthProviderEnum } from "@src/constants/common.constant";

const Google = () => {
  // const code = useNextQueryParam("code");
  const accessToken = useNextQueryParam("access_token");

  useEffect(() => {
    if (accessToken) {
      const openerWindow = window.opener;
      if (openerWindow) {
        openerWindow.postMessage({ code: accessToken, provider: OauthProviderEnum.Google });
        window.close();
      }
    }
  }, []);

  return <div></div>;
};

export default Google;
