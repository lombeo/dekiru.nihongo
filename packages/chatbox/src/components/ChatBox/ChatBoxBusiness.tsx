import { ActionChatType, ChatChanelEnum } from "@chatbox/constants";
import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { useChatSocket } from "@chatbox/hook/useChatSocket";
import { useClearHistories } from "@chatbox/hook/useClearHistories";
import { useGetChatList } from "@chatbox/hook/useGetChatList";
import { useLeaveRoom } from "@chatbox/hook/useLeaveRoom";
import { useSeenNotifyChat } from "@chatbox/hook/useSeenNotifyChat";
import { ChatModelData } from "@chatbox/types/base";
import { confirmAction } from "@edn/components/ModalConfirm";
import { selectOpenDrawerChat, setChatWindows, setOpenDrawerChat } from "@src/store/slices/chatSlice";
import { cloneDeep } from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

const ChatBoxBusiness = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const store = useStore();
  const openDrawerChat = useSelector(selectOpenDrawerChat);

  useChatSocket();

  const { refetch } = useGetChatList();
  const { markSeenNotifyChat } = useSeenNotifyChat();
  const { clearHistories } = useClearHistories();
  const { leaveRoom } = useLeaveRoom();

  const syncWidth = useCallback(() => {
    setTimeout(function () {
      const isTablet = window.innerWidth > 768;
      if (isTablet) {
        let rem = 16;
        //Width of bubble area
        let bubbleAreaWidth = 4.125 * rem;
        //Width of chat group area
        const openDrawerChat = (store.getState() as any)?.chat?.openDrawerChat;
        let chatRootWidth = openDrawerChat ? 24 * rem : 0;
        const chatWindows = (store.getState() as any)?.chat?.chatWindows;

        //Check if have enough space to display show all chat window, if not -> push oldest chat to bubble
        const numOfChatWindow = chatWindows.filter((item: any) => !item.isMinimize).length;
        const widthOfChatWindow = numOfChatWindow * 20.5 * rem;
        const needToPushBubble = widthOfChatWindow > window.innerWidth - bubbleAreaWidth - chatRootWidth;
        if (!needToPushBubble) {
          return;
        } else {
          let listActiveRoom = cloneDeep(chatWindows);
          const listOpen = listActiveRoom.filter((item) => !item.isMinimize);
          let isClosed = listOpen.some((item: any, index: number) => {
            if (!ChatBoxHelper.hasContentIsTyping(item.id) && index < listOpen.length - 1) {
              item.isMinimize = true;
              return true;
            }
          });
          if (!isClosed) {
            listOpen.some((item: any, index: number) => {
              if (index < listOpen.length - 1) {
                item.isMinimize = true;
                return true;
              }
            });
          }
          dispatch(setChatWindows(listActiveRoom));
        }
      }
    }, 200);
  }, []);

  const openBox = useCallback((_data: ChatModelData) => {
    const data = cloneDeep(_data);
    const chatWindows = (store.getState() as any)?.chat?.chatWindows;
    let existRoom = chatWindows?.find((item) => {
      return item.id === data.id;
    });
    if (existRoom) {
      existRoom = { ...existRoom, ..._data };
      const index = chatWindows.findIndex((item: any) => item.id == data.id);
      if (index === chatWindows.length - 1 && !existRoom.isMinimize) {
        return;
      }
      existRoom.isMinimize = false;
      let listActiveRoom = [...chatWindows];
      listActiveRoom.splice(index, 1);
      listActiveRoom.push(existRoom);
      dispatch(setChatWindows(listActiveRoom));
    } else {
      //Bật cửa sổ chat mới
      data.isMinimize = false;
      data.lastActiveTime = new Date().valueOf();
      dispatch(setChatWindows([...chatWindows, data]));
    }
    syncWidth();
  }, []);

  useEffect(() => {
    let onOpen = PubSub.subscribe(ChatChanelEnum.OPEN_CHAT, (chanel, { data }) => {
      // dispatch(setOpenDrawerChat(false));
      openBox(data);
      //After open chatbox, scroll to bottom of chat
      setTimeout(function () {
        let detailChat = document.getElementById(`detail-chat-${data.id}`);
        if (detailChat != null) {
          detailChat.scrollTo(0, detailChat.scrollHeight);
        }
      }, 300);
    });
    return () => {
      PubSub.unsubscribe(onOpen);
    };
  }, [openBox, store]);

  useEffect(() => {
    const closeChat = PubSub.subscribe(ChatChanelEnum.CLOSE_CHAT_WINDOW, (chanel, { id }) => {
      const chatWindows = (store.getState() as any)?.chat?.chatWindows;
      dispatch(setChatWindows(chatWindows.filter((item: any) => item.id !== id)));
    });
    const minimize = PubSub.subscribe(ChatChanelEnum.MINIMIZE_CHAT_WINDOW, (chanel, { id }) => {
      const chatWindows = (store.getState() as any)?.chat?.chatWindows;
      dispatch(
        setChatWindows(
          cloneDeep(chatWindows).map((item) => {
            if (item && item?.id == id) {
              item.isMinimize = true;
            }
            return item;
          })
        )
      );
    });
    return () => {
      PubSub.unsubscribe(closeChat);
      PubSub.unsubscribe(minimize);
    };
  }, [store]);

  useEffect(() => {
    if (openDrawerChat) {
      refetch();
      syncWidth();
    }
  }, [openDrawerChat]);

  useEffect(() => {
    // fetchSetting();
    const onCloseAllChat = PubSub.subscribe(ChatChanelEnum.CLOSE_ALL_CHAT_WINDOW, () => {
      dispatch(setChatWindows([]));
    });
    const onNotify = PubSub.subscribe(ChatChanelEnum.ON_NEW_NOTIFY, () => {
      refetch();
    });
    const onUserAdd = PubSub.subscribe(ChatChanelEnum.UPDATE_CHAT_ROOM_LIST_WHEN_USER_ADD, () => {
      refetch();
    });
    const onRefresh = PubSub.subscribe(ChatChanelEnum.ON_FRESH_DATA, () => {
      refetch();
    });
    // const onSetChatWindows = PubSub.subscribe(ChatChanelEnum.OPEN_CHAT, (chanel, { data }) => {
    //   appMessage.postMessage(AppChatPostMessage["EDV.API.ChatWindows.set"], data);
    // });
    let actions = PubSub.subscribe(ChatChanelEnum.ACTION_MENU_IN_SIDEBAR, (mess, { id: id, action: action }) => {
      switch (action) {
        case ActionChatType.LEAVE:
          const onConfirm = () => {
            leaveRoom(id);
          };
          confirmAction({
            message: t("Are you sure to leave this conversation? You will not send or receive messages anymore."),
            onConfirm,
          });
          break;
        case ActionChatType.CLEAR_CHAT:
          clearHistories(id);
          markSeenNotifyChat(id);
          break;
      }
    });
    return () => {
      PubSub.unsubscribe(onUserAdd);
      PubSub.unsubscribe(onNotify);
      PubSub.unsubscribe(onRefresh);
      PubSub.unsubscribe(onCloseAllChat);
      PubSub.unsubscribe(actions);
      // PubSub.unsubscribe(onSetChatWindows);
    };
  }, []);

  return null;
};

export default ChatBoxBusiness;
