import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MS_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL + "/oauth/ms",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginMsRequest = {
  scopes: ["User.Read"],
};
