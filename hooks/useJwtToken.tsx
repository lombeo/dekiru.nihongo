import { getAccessToken, getChatToken } from "@src/api/axiosInstance";
import { COOKIES_NAME, LOCAL_STORAGE, PubsubTopic } from "@src/constants/common.constant";
import { getCookie, removeCookie } from "@src/helpers/cookies.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { FriendService } from "@src/services/FriendService/FriendService";
import { setProfile, setRoles } from "@src/store/slices/authSlice";
import PubSub from "pubsub-js";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useJwtToken = () => {
  const dispatch = useDispatch();

  const handleConnectChatSocket = useCallback(() => {
    setTimeout(() => {
      PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
    }, 1000);
  }, []);

  const loadProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      dispatch(setProfile(null));
      return;
    }
    const profileToken = FunctionBase.parseJwt(token);

    if (profileToken) {
      dispatch(
        setProfile({
          userId: +profileToken.Id,
          email: profileToken.Email,
          userName: profileToken.UserName,
          displayName: profileToken.FullName,
          avatarUrl: profileToken.AvatarUrl,
        })
      );
      dispatch(setRoles(profileToken.Roles));
    } else {
      dispatch(setProfile(null));
      localStorage.removeItem(LOCAL_STORAGE.TOKEN);
    }
  }, [dispatch]);

  const fetchChatToken = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      localStorage.removeItem(LOCAL_STORAGE.CHAT_TOKEN);
      return;
    }

    let chatToken = getChatToken();
    if (chatToken && chatToken.token && chatToken.chatToken && chatToken.token === token) {
      handleConnectChatSocket();
      return;
    }

    const res = await FriendService.relationshipChatToken();
    if (res?.data?.success) {
      localStorage.setItem(
        LOCAL_STORAGE.CHAT_TOKEN,
        JSON.stringify({
          chatToken: res.data.data,
          token: token,
        })
      );
      handleConnectChatSocket();
    }
  }, [handleConnectChatSocket]);

  const fetchChatAnonymousToken = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      removeCookie(COOKIES_NAME.CHAT_ANONYMOUS_TOKEN);
      return;
    }
    const anonymousToken = getCookie(COOKIES_NAME.CHAT_ANONYMOUS_TOKEN);
    if (anonymousToken) {
      handleConnectChatSocket();
      return;
    }
  }, [handleConnectChatSocket]);

  return useCallback(() => {
    loadProfile();
    fetchChatToken();
    fetchChatAnonymousToken();
  }, [fetchChatToken, fetchChatAnonymousToken, loadProfile]);
};

export default useJwtToken;

export const getAnonymousUser = () => {
  if (typeof window !== "undefined") {
    let rs = null;
    try {
      const cookie = getCookie(COOKIES_NAME.CHAT_ANONYMOUS_TOKEN);
      if (!cookie) return null;
      rs = cookie;
    } catch (e) {}
    return rs;
  }
  return null;
};
