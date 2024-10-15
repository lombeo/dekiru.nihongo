import React, { useEffect } from "react";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { OauthProviderEnum } from "@src/constants/common.constant";

const Github = () => {
  const code = useNextQueryParam("code");

  useEffect(() => {
    if (code) {
      const openerWindow = window.opener;
      if (openerWindow) {
        openerWindow.postMessage({ code, provider: OauthProviderEnum.GitHub });
        window.close();
      }
    }
  }, []);

  return <div></div>;
};

export default Github;
