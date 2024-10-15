import { Notify } from "@src/components/cms";
import { LOCAL_STORAGE } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import axios from "axios";
import { PubsubTopic } from "config";
import { isEmpty } from "lodash";
import { i18n } from "next-i18next";
import NProgress from "nprogress";
import PubSub from "pubsub-js";
import qs from "qs";

export const TOKEN_NAME = "Authorization";
export const CL_TOKEN_NAME = "CodelearnToken";

export const getAccessToken = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem(LOCAL_STORAGE.TOKEN);
  }
  return token && !isEmpty(token) && token !== "null" ? token : null;
};

export const getChatToken = () => {
  if (typeof window !== "undefined") {
    let chatToken = null;
    try {
      chatToken = JSON.parse(localStorage.getItem(LOCAL_STORAGE.CHAT_TOKEN));
    } catch (e) {}
    return chatToken;
  }
  return null;
};

export const getRequestHeaders = () => {
  const token = getAccessToken();
  const chatToken = getChatToken();
  const anonymousUser = getAnonymousUser();
  const headers: any = {};

  if (token) {
    headers[TOKEN_NAME] = `Bearer ${token}`;
    if (chatToken && chatToken.chatToken?.token) {
      headers[CL_TOKEN_NAME] = chatToken.chatToken?.token;
    }
  } else if (anonymousUser) {
    headers[CL_TOKEN_NAME] = anonymousUser?.token;
  }

  try {
    headers.language = i18n?.language === "vi" ? "vn" : "en";
  } catch (e) {}

  return headers;
};

const baseURL = process.env.NEXT_PUBLIC_API_LEARNV2;

export const axiosInstance = axios.create({
  baseURL,
  headers: getRequestHeaders(),
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // if (config.method.toLowerCase() === "get" && config.params) {
  //   config.params = QueryUtils.sanitizeObj(config.params);
  // }
  if (
    !(
      (config.data && (JSON.stringify(config.data) as any).progress === false) ||
      config.params?.progress === false ||
      config.data?.progress === false ||
      FunctionBase.getParameterByName("progress", config.url) == "false"
    )
  ) {
    NProgress.start();
  }

  config.headers = {
    ...config.headers,
    ...getRequestHeaders(),
  };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();

    const statusCode = response.data.code;
    let message = response.data.message;

    if (response.data?.success === false) {
      Notify.error(i18n.t(message));
    }

    const errorHandle = response.config.headers.errorHandle;
    if (errorHandle !== undefined && !errorHandle) return response;

    // if (statusCode === 401) {
    //   message = "Please login again!";
    //   // PubSub.publish(PubsubTopic.API_ERROR, { message, statusCode });
    //   PubSub.publish(PubsubTopic.FORCE_LOGIN);
    // }

    if (statusCode === 403 || message === "Common_403") {
      if (getAccessToken()) {
        message = "Your role or permission is not enough to access this function!";
        PubSub.publish(PubsubTopic.API_ERROR, { message, statusCode: 403 });
      }
    }

    if (statusCode === 404 || message === "Common_404") {
      message = "The page cannot be found, or you are not allowed to access this page";
      PubSub.publish(PubsubTopic.API_ERROR, { message, statusCode: 404 });
    }

    // if (statusCode === 500) {
    // PubSub.publish(PubsubTopic.API_ERROR, { message, statusCode });
    // }

    return response;
  },
  (error) => {
    NProgress.done();
    const response = error.response;
    if (response) {
      let message = "";
      let requestUrl = response.config?.url;
      let skipErrorPage = FunctionBase.getParameterByName("skipErrorPage", requestUrl) ?? false;
      if (skipErrorPage) handleError(error);
      else {
        if (error.response.status === 401) {
          message = "Please login again!";
          PubSub.publish(PubsubTopic.FORCE_LOGIN);
        } else if (error.response.status === 403) {
          if (!getAccessToken()) {
            PubSub.publish(PubsubTopic.FORCE_LOGIN);
          } else {
            message = "Your role or permission is not enough to access this function!";
            PubSub.publish(PubsubTopic.API_ERROR, { message, statusCode: 403 });
          }
        } else if (error.response.status === 404) {
          message = "The page cannot be found, or you are not allowed to access this page";
          PubSub.publish(PubsubTopic.API_ERROR, { message, statusCode: 404 });
        } else {
          //message = "Request api has response with error " + error.response.status;
          //message = error.message + "\n";
          message += JSON.stringify(error?.response?.data?.Message);

          handleError(error);
        }
      }
    } else {
      handleError(error);
    }
  }
);

let lastMessage = "";
export function handleError(error: any) {
  if (error?.config?.url?.includes("relationship/chat-token")) return;

  let message = "";
  if (error.response)
    message = error.response?.data?.Message || error.response?.data?.title || error.response?.data?.message;
  else if (error.request) message = error.message;
  else message = error.message;

  if (message === lastMessage) return;
  if (message == null || message == "") {
    message = "An error occurred while processing data";
  }
  Notify.error(i18n.t(message));
  lastMessage = "";
}
