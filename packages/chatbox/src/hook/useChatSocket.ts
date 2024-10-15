import { ChanelProps, ChatChanelEnum, TypeMessageChatEnum, TypeOfSystemMessageEnum } from "@chatbox/constants";
import { ChatAPIEnums, ChatAPIs } from "@chatbox/services/apis";
import { ChatService } from "@chatbox/services/chat.service";
import { ChatModelData } from "@chatbox/types/base";
import { Notify } from "@edn/components/Notify/AppNotification";
import { getAccessToken, getChatToken } from "@src/api/axiosInstance";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { selectProfile } from "@src/store/slices/authSlice";
import { selectSiteSocket, setCount, setSiteSocket } from "@src/store/slices/chatSlice";
import { Stomp } from "@stomp/stompjs";
import mixpanel from "mixpanel-browser";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import SockJS from "sockjs-client";
import { getListRoomChat } from "./useGetChatList";

export const useOpenNotifyChat = () => {
  const { openSubscribe } = useOpenSubscribe();

  const openNotifyChat = (callback: any, currentUserId: any) => {
    const url = ChatAPIEnums.CHAT_NOTIFY_CHAT + currentUserId;
    openSubscribe(
      url,
      (message: any) => {
        callback(message);
      },
      "user-" + currentUserId
    );
  };

  return { openNotifyChat };
};

export const useChatSocket = (): any => {
  const { t } = useTranslation();

  const token = getAccessToken();

  const store = useStore();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const siteSocket = useSelector(selectSiteSocket);
  const { openNotifyChat } = useOpenNotifyChat();

  const onServerConnected = () => {
    const anonymousUser = getAnonymousUser();
    const profileToken = FunctionBase.parseJwt(token);
    const currentUserId = profileToken ? +profileToken?.Id : anonymousUser?.userId;

    if (!currentUserId) return;

    // console.log("Server connected");
    openNotifyChat((serverMessage: any) => {
      const messageContent = JSON.parse(serverMessage.body);
      //Define some default variable.
      const roomId = messageContent.roomId;
      const senderId = messageContent.senderId;
      const messageType = messageContent.messageType;

      dispatch(setCount(messageContent.total));
      // if ((senderId == ADMIN_ID || roomId == adminRoomId) && profile?.userId != ADMIN_ID) {
      //   handleChatAdmin();
      // }

      // let chatWindowsOpen = getChatWindowsChat();
      let listRoomChat = getListRoomChat();
      //Case mark seen
      if (messageContent?.message?.roomId && messageType === TypeMessageChatEnum.USER_SEEN_MESSAGE) {
        PubSub.publish(ChatChanelEnum.ON_NEW_NOTIFY, messageContent);
      }
      if (roomId && senderId != currentUserId) {
        if (
          [TypeMessageChatEnum.SYSTEM_MESSAGE, TypeMessageChatEnum.TEXT].includes(messageType) &&
          messageContent?.message?.type !== TypeOfSystemMessageEnum.USERS_REMOVED
        ) {
          PubSub.publish(ChatChanelEnum.ON_NEW_NOTIFY, messageContent);
        }
      }

      if (roomId == undefined) {
        return;
      }
      //Handle start the first time chat with user
      if (messageType !== undefined && messageType === TypeMessageChatEnum.SYSTEM_MESSAGE) {
        let _currentMessage = messageContent.message;
        let _type = _currentMessage?.type;
        if (_type == TypeOfSystemMessageEnum.PRIVATE_CHAT_STARTED) {
          PubSub.publish(TypeOfSystemMessageEnum.PRIVATE_CHAT_STARTED, {
            id: roomId,
          });
        }
      }
      //Checking if room chat is exist
      if (listRoomChat && listRoomChat.findIndex((item: ChatModelData) => item?.id === roomId) !== -1) {
        if (messageType !== undefined && messageType === TypeMessageChatEnum.SYSTEM_MESSAGE) {
          let currentMessage = messageContent.message;
          let type = currentMessage?.type;
          //For case user left or remove from room
          const unsubscribe =
            (type == TypeOfSystemMessageEnum.USERS_LEFT_ROOM && senderId == currentUserId) ||
            (type == TypeOfSystemMessageEnum.USERS_REMOVED && currentUserId == currentMessage.message.members[0].id);
          if (unsubscribe) {
            //MORE_INHANCE Need add Check and scroll to bottom of chat
          }
          const userAdded =
            type == TypeOfSystemMessageEnum.USERS_ADDED && currentMessage.message.members[0].id == currentUserId;
          // && chatWindowsOpen?.findIndex((item: ChatModelData) => item.id === roomId) !== -1;

          const updateListRoom =
            type == TypeOfSystemMessageEnum.USERS_ADDED && currentMessage.message.members[0].id == currentUserId;
          if (updateListRoom) {
            PubSub.publish(ChatChanelEnum.UPDATE_CHAT_ROOM_LIST_WHEN_USER_ADD, roomId);
          }
          //When user is removed and then add back to group again
          if (userAdded) {
            PubSub.publish(ChatChanelEnum.USER_ADD, { room_Id: roomId });
          }
        }
      }
    }, currentUserId);
  };

  const createSockConnect = (token) => {
    try {
      const sock = new SockJS(ChatAPIs.CHAT_SOCKET_CONNECTION + Buffer.from(token).toString("base64"), null, {
        transports: "websocket",
      });
      sock.onerror = function (error) {
        console.info("sock Error - Connect retry:" + new Date().toLocaleString());
        sock.close();

        mixpanel?.track("error-chat", {
          description: "Create connect socket (1)",
          error: error ? JSON.stringify(error) : "",
          userName: profile?.userName,
        });
        Notify.warning(t("The messaging system is currently busy. Please try again later"));

        setTimeout(() => {
          PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
        }, 2000);
      };
      sock.onclose = function (error) {
        console.error("sock - Server Err:" + JSON.stringify(error));
        console.info("sock - Connect retry:" + new Date().toLocaleString());
        siteSocket?.disconnect?.();
      };
      return sock;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const onConnectChatSocket = PubSub.subscribe(PubsubTopic.CONNECT_CHAT_SOCKET, () => {
      if (window?.navigator && !window.navigator.onLine) {
        return;
      }
      const anonymousUser = getAnonymousUser();
      const chatToken = token ? getChatToken()?.chatToken?.token : anonymousUser?.token;
      if (!chatToken) return;
      let sock: WebSocket | null;
      const siteSocket = (store.getState() as any)?.chat?.siteSocket;
      if (siteSocket) {
        return;
      }
      try {
        sock = createSockConnect(chatToken);
        if (sock) {
          let newSiteSocket = Stomp.over(sock);
          newSiteSocket.connect({}, onServerConnected, (error) => {});
          newSiteSocket.debug = () => {};
          dispatch(setSiteSocket(newSiteSocket));
        }
      } catch (error) {}
      return () => {
        try {
          dispatch(setSiteSocket(null));
          sock?.close?.();
        } catch (e) {}
      };
    });
    return () => {
      PubSub.unsubscribe(onConnectChatSocket);
    };
  }, []);
};

export const useOpenSubscribe = () => {
  const store = useStore();
  const { t } = useTranslation();

  const openSubscribe = (url: string, callback: any, subId: string) => {
    const siteSocket = (store.getState() as any)?.chat?.siteSocket;
    setTimeout(() => {
      try {
        if (siteSocket) {
          siteSocket.subscribe(url, callback, { id: subId });
        }
      } catch (error) {
        setTimeout(() => {
          PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
        }, 2000);
      }
    }, 1000);
  };

  return { openSubscribe };
};

/**
 * sendMessage - Handle send message
 * Use for send a message
 */
export const useSendMessage = () => {
  const store = useStore();
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  const sendMessage = (currentRoomId: any, messageInfo: any, onSuccess?: () => any, onError?: (error: any) => any) => {
    const siteSocket = (store.getState() as any)?.chat?.siteSocket;
    console.log("messageInfo", messageInfo);

    try {
      siteSocket.send("/chat/message/" + currentRoomId, {}, JSON.stringify(messageInfo));
      onSuccess?.();
    } catch (error) {
      onError?.(error);
      Notify.warning(t("The messaging system is currently busy. Please try again later"));
      mixpanel?.track("error-chat", {
        description: "Send message (2)",
        error: error ? JSON.stringify(error) : "",
        userName: profile?.userName,
      });
    }
  };

  return { sendMessage };
};

let listSubscribeId = new Set();
export const useChannel = (props: ChanelProps, locale = "vi"): any => {
  const { roomId } = { ...props };
  const isActive = true;
  const type = "private";
  const [messages, addMessage] = useState(undefined);
  const [updateMessages, setUpdateMessages] = useState(undefined);
  const { openSubscribe } = useOpenSubscribe();
  const siteSocket = useSelector(selectSiteSocket);
  const { closeChanel } = useCloseChanel();

  useEffect(() => {
    let listMessages = updateMessages || [];
    //If active, subscribe channel and get messages
    if (isActive) {
      const url = (type === "private" ? ChatAPIEnums.CHAT_SUB_PRIVATE : ChatAPIEnums.CHAT_SUB_GROUP) + roomId;
      //Store current message and update next time when message comming. Using for reduce render cycle.
      openSubscribe(
        url,
        (currentMessage: any) => {
          if (!listSubscribeId.has(roomId)) {
            listSubscribeId.add(roomId);
          }
          const messagesData = JSON.parse(currentMessage.body);
          console.log("receive", messagesData);

          //For load history
          if (
            typeof messagesData.messages != "undefined" ||
            Object.prototype.toString.call(messagesData) === "[object Array]"
          ) {
            listMessages = messagesData.messages;
            addMessage(messagesData.messages);
          } else {
            //For add new
            if (currentMessage.type != "USER_SEEN_MESSAGE") {
              listMessages = mergeMessages(listMessages, messagesData);
              addMessage(listMessages);
            }
          }
          props?.afterGetMessage && props.afterGetMessage();
        },
        roomId
      );
    }
    //If no active, load api
    else {
      loadMoreMessage(
        {
          limit: 15,
          timestamp: null,
          chatId: roomId,
        },
        locale
      );
    }
    return () => {
      listSubscribeId.delete(roomId);
      if (siteSocket) {
        try {
          siteSocket?.unsubscribe?.(roomId);
        } catch (e) {}
      }
    };
  }, [roomId]);

  useEffect(() => {
    addMessage(updateMessages);
  }, [updateMessages]);

  /**
   * mergeMessages - merge list message to one.
   * @param oldMessage previous list<array> message
   * @param newMessage new message
   * @returns Array<any> list message
   */
  const mergeMessages = (oldMessage: Array<any>, newMessage: any) => {
    //Check label no more load to remove
    let lbNomore = document.querySelector(`#chat-window-${roomId} .detail-chat > .chat-nomore-message`);
    if (lbNomore != null) {
      lbNomore.parentNode.removeChild(lbNomore);
    }
    //Case update message
    if (oldMessage && oldMessage.length > 0 && oldMessage.filter((x: any) => x?.id === newMessage?.id).length > 0) {
      oldMessage = oldMessage.filter((x: any) => x?.id !== newMessage?.id);
    }
    return oldMessage && oldMessage.length > 0 ? [...oldMessage, ...[newMessage]] : [newMessage];
  };

  /**
   * addHistories - Update history to current data.
   * @param data
   */
  const addHistories = (data: Array<any>) => {
    setUpdateMessages(messages ? [...data, ...messages] : data);
  };
  /**
   * Reconnect chat socket
   */
  const reConnect = () => {
    closeChanel(roomId);

    let listMessages = updateMessages || [];
    const url = (type === "private" ? ChatAPIEnums.CHAT_SUB_PRIVATE : ChatAPIEnums.CHAT_SUB_GROUP) + roomId;
    //Store current message and update next time when message comming. Using for reduce render cycle.

    openSubscribe(
      url,
      (currentMessage: any) => {
        if (!listSubscribeId.has(roomId)) {
          listSubscribeId.add(roomId);
        }
        const messagesData = JSON.parse(currentMessage.body);
        //For load history
        if (
          typeof messagesData.messages != "undefined" ||
          Object.prototype.toString.call(messagesData) === "[object Array]"
        ) {
          listMessages = messagesData.messages;
          addMessage(messagesData.messages);
        } else {
          //For add new
          if (currentMessage.type != "USER_SEEN_MESSAGE") {
            listMessages = mergeMessages(listMessages, messagesData);
            addMessage(listMessages);
          }
        }
        props?.afterGetMessage && props.afterGetMessage();
      },
      roomId
    );
  };
  /**
   * Load more message handle
   * @param filterData (limit, timestamp, chatId, roomType)
   */
  const loadMoreMessage = async (filterData: any, locale = "en") => {
    await ChatService.getChatHistoryPrivate({
      limit: filterData.limit,
      timestamp: filterData.timestamp,
      chatId: filterData.chatId,
    })
      .then((respone: any) => {
        //Check if have no data -> do not add histories
        if (respone?.data?.messages.length > 0) {
          addHistories(respone?.data?.messages);
          //Scroll down
          scrollDown(filterData.chatId);
        } else {
          appendNomoreMessage(filterData, locale);
        }
      })
      .catch(() => {});
  };
  //Scroll down
  const scrollDown = (roomId: string) => {
    const detailChat = document.getElementById(`detail-chat-${roomId}`);
    if (detailChat != null) {
      detailChat.scrollBy(0, 10);
    }
  };
  return { messages, addHistories, loadMoreMessage, reConnect };
};

/**
 * Prepend nore message to chat box
 * @param filterData data filter
 */
const appendNomoreMessage = (filterData: any, locale = "vi") => {
  //No more load
  let lbNomore = document.querySelector(`#chat-window-${filterData.chatId} .detail-chat > .chat-nomore-message`);
  let chatWin = document.querySelector(`#chat-window-${filterData.chatId} .detail-chat`);
  if (lbNomore == null) {
    let html = document.createElement("div");
    html.setAttribute("class", "chat-nomore-message w-full text-center text-sm mb-2");
    let textLoadmore = "No more load";
    if (locale == "vi") {
      textLoadmore = "Không còn tin nhắn";
    } else if (locale == "jp") {
      textLoadmore = "新しいメッセージはありません";
    }
    let textNode = document.createTextNode(textLoadmore);
    html.appendChild(textNode);
    chatWin.insertBefore(html, chatWin.childNodes[0]);
  }
};

export const updateLastActiveTimeWindow = (roomId: string) => {
  // chatWindowsChat.forEach((item: ChatModelData) => {
  //   if (item.id === roomId) {
  //     item.lastActiveTime = new Date().valueOf();
  //   }
  // });
};

export const useCloseChanel = () => {
  const siteSocket = useSelector(selectSiteSocket);

  const closeChanel = (roomId: any) => {
    listSubscribeId?.delete(roomId);
    if (siteSocket) {
      try {
        siteSocket?.unsubscribe?.(roomId);
      } catch (e) {}
    }
  };

  return { closeChanel };
};
