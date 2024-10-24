import ChatBoxBusiness from "@chatbox/components/ChatBox/ChatBoxBusiness";
import { ListChatWindow } from "@chatbox/components/ChatWindow";
import DrawerChatRoom from "@chatbox/components/DrawerChatRoom/DrawerChatRoom";
import { ChatChanelEnum } from "@chatbox/constants";
import { ActionIcon, Image } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import { ADMIN_ID, CHATGPT_ID } from "@src/config";
import { COOKIES_NAME, PubsubTopic } from "@src/constants/common.constant";
import { EMAIL_SUPPORT } from "@src/constants/contact.constant";
import { getCookie, setCookie } from "@src/helpers/cookies.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import recaptcha from "@src/helpers/recaptcha.helper";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectProfile } from "@src/store/slices/authSlice";
import { selectCount, selectListRoomChat, setOpenDrawerChat } from "@src/store/slices/chatSlice";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";

const Chat = () => {
  return (
    <>
      <ChatBoxBusiness />
      <DrawerChatRoom />
      <ListChatWindow />
    </>
  );
};

export default Chat;

export const handleExtendAnonymousUser = () => {
  setCookie(
    COOKIES_NAME.CHAT_ANONYMOUS_TOKEN,
    getCookie(COOKIES_NAME.CHAT_ANONYMOUS_TOKEN),
    moment().add(1, "week").toDate()
  );
};

export const ChatSticky = () => {
  const { t } = useTranslation();
  const token = getAccessToken();
  const dispatch = useDispatch();

  const totalCount = useSelector(selectCount);
  const profile = useSelector(selectProfile);
  const listRoomChat = useSelector(selectListRoomChat);

  const [notifyCountAnonymous, setNotifyCountAnonymous] = useState(0);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const profileToken = FunctionBase.parseJwt(token);

  const roomChatGPT = listRoomChat?.find((e) => e.friend?.id === CHATGPT_ID);
  const chatGPTCount = roomChatGPT?.notifyCount || 0;

  const roomChatAdmin = listRoomChat?.find((e) => e.friend?.id === ADMIN_ID);
  let chatAdminCount = roomChatAdmin?.notifyCount || 0;
  if (!token) {
    chatAdminCount = notifyCountAnonymous;
  }

  let count = totalCount;
  
  if (!token) {
    count = totalCount - chatAdminCount - chatGPTCount;
  }

  const openChatBox = (targetUserId: number, user: any) => {
    const anonymousUser = getAnonymousUser();
    const currentUserId = profileToken ? +profileToken?.Id : anonymousUser?.userId;
    if (!currentUserId) return;
    const roomId =
      targetUserId > currentUserId ? `${currentUserId}_${targetUserId}` : `${targetUserId}_${currentUserId}`;
    const dataRoom = {
      data: {
        id: roomId,
        lastMessageTimestamp: new Date(),
        friend: {
          id: targetUserId,
          username: user?.username,
          fullName: user?.username,
          avatarUrl: user?.avatarUrl,
        },
      },
    };
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, dataRoom);
  };

  const handleFetchAnonymousUser = useCallback(() => {
    if (!executeRecaptcha) {
      return;
    }
    recaptcha.show();
    executeRecaptcha("enquiryFormSubmit")
      .then(async (gReCaptchaToken) => {
        recaptcha.hidden();
        const res = await FriendService.relationshipChatToken(gReCaptchaToken);
        if (res?.data?.success) {
          setCookie(
            COOKIES_NAME.CHAT_ANONYMOUS_TOKEN,
            {
              token: res.data.data?.token,
              userId: res.data.data?.userId,
            },
            moment().add(1, "week").toDate()
          );
          PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
          openChatBox(ADMIN_ID, {
            username: EMAIL_SUPPORT,
            avatarUrl: "/images/chat/icon-chat-cl.png",
          });
        }
      })
      .catch(() => {
        recaptcha.hidden();
      });
  }, [executeRecaptcha]);

  const handleChatSupport = useCallback(
    _.debounce(() => {
      const anonymousToken = getCookie(COOKIES_NAME.CHAT_ANONYMOUS_TOKEN);
      if (anonymousToken) {
        openChatBox(ADMIN_ID, {
          username: EMAIL_SUPPORT,
          avatarUrl: "/images/chat/icon-chat-cl.png",
        });
        handleExtendAnonymousUser();
      } else {
        handleFetchAnonymousUser();
      }
    }, 500),
    [handleFetchAnonymousUser]
  );

  useEffect(() => {
    const onNewNotify = PubSub.subscribe(ChatChanelEnum.ON_NEW_NOTIFY, (message: any, data: any) => {
      if (data?.senderId === ADMIN_ID || data?.message?.sender?.id) {
        setNotifyCountAnonymous(data?.messageType === "USER_SEEN_MESSAGE" ? 0 : 1);
      }
    });
    return () => {
      PubSub.unsubscribe(onNewNotify);
    };
  }, []);

  return (
    <>
      <div className="bottom-20 fixed right-5 z-[191] flex flex-col gap-2">
        {!token ? (
          <div className="flex gap-4 flex-col rounded-[60px] hover:-translate-y-1 duration-300">
            <ActionIcon
              className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative"
              size="48px"
              radius="xl"
              data-tooltip-id="global-tooltip"
              data-tooltip-content={t("Chat with Dekiru")}
              data-tooltip-place="top"
              onClick={() => handleChatSupport()}
            >
              <Image alt="" src="/images/chat/icon-chat-cl.png" fit="cover" height={48} width={48} />
              {chatAdminCount > 0 && (
                <div className="text-sm font-semibold z-10 text-[#fff] bg-[#f1646c] rounded-full absolute top-[-2px] left-[32px] flex items-center justify-center min-w-[20px] px-1 h-[20px]">
                  {chatAdminCount > 9 ? "9+" : chatAdminCount}
                </div>
              )}
            </ActionIcon>
          </div>
        ) : null}
        {token && (
          <div className="flex gap-4 flex-col rounded-[60px] hover:-translate-y-1 duration-300">
            <ActionIcon
              className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative"
              size="48px"
              radius="xl"
              onClick={() => {
                dispatch(setOpenDrawerChat(true));
              }}
            >
              <Image alt="" src="/images/chat.png" fit="cover" height={48} width={48} />
              {count > 0 && (
                <div className="text-sm font-semibold z-10 text-[#fff] bg-[#f1646c] rounded-full absolute top-[-2px] left-[32px] flex items-center justify-center min-w-[20px] px-1 h-[20px]">
                  {count > 9 ? "9+" : count}
                </div>
              )}
            </ActionIcon>
          </div>
        )}
      </div>
    </>
  );
};
