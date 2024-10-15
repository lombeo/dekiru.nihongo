import ModalAddMember from "@chatbox/components/ModalAddMember";
import { ActionChatType, ChatChanelEnum } from "@chatbox/constants";
import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { useAddMembersToRoom } from "@chatbox/hook/useAddMembersToRoom";
import { useChannel, useCloseChanel } from "@chatbox/hook/useChatSocket";
import { useClearHistories } from "@chatbox/hook/useClearHistories";
import { useGetMembersOfRoom } from "@chatbox/hook/useGetMembersOfRoom";
import { useLeaveRoom } from "@chatbox/hook/useLeaveRoom";
import { useRemoveMemberFromRoom } from "@chatbox/hook/useRemoveMemberFromRoom";
import { useSeenNotifyChat } from "@chatbox/hook/useSeenNotifyChat";
import { Visible } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Button } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { ADMIN_ID, CHATGPT_ID } from "@src/config";
import { EMAIL_SUPPORT } from "@src/constants/contact.constant";
import { useRouter } from "@src/hooks/useRouter";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatHeadMenu } from "../ChatRoomItem";
import ChangeGroupName from "./ChangeGroupName";
import DetailChat from "./ChatContents/DetailChat";
import styles from "./ChatWindow.module.scss";
import FormSendChat from "./FormSendChat/FormSendChat";
import ListMembers from "./ListMembers";
import ReplyArea from "./ReplyArea";

const ChatWindow = (props: any) => {
  const { data } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const { locale } = useRouter();

  const chatGPTRoomId =
    CHATGPT_ID > profile?.userId ? `${profile?.userId}_${CHATGPT_ID}` : `${CHATGPT_ID}_${profile?.userId}`;
  const { messages: systemMessages, loadMoreMessage, reConnect } = useChannel({ roomId: data.id }, locale);
  const { closeChanel } = useCloseChanel();
  const { clearHistories } = useClearHistories((id) => {
    closeChanel(data.id);
  });
  const [loading, setLoading] = useState(false);
  const isChatGPT = data.friend?.id === CHATGPT_ID;

  const messages =
    loading && isChatGPT
      ? [
          ...(systemMessages || []),
          {
            id: "1234",
            roomId: chatGPTRoomId,
            senderId: CHATGPT_ID,
            timestamp: new Date(),
            type: "LOADING",
            deleted: false,
            privateChat: true,
            replyMessageId: "",
            reactions: [],
            sender: {
              id: CHATGPT_ID,
              username: "GPT",
              fullName: "GPT",
              avatarUrl:
                "https://codelearnstorage.s3.amazonaws.com/CodeCamp/CodeCamp/Upload/Avatar/bef5badd33ad48d2a718973757f2d7c4.jpeg",
              preventShowChat: false,
            },
          },
        ]
      : systemMessages;

  const { dataRoom, setFilterDataRoom } = useGetMembersOfRoom();
  const { addMemberToRoom } = useAddMembersToRoom(() => {
    setIsShowAddMember(false);
  });
  const { removeMember } = useRemoveMemberFromRoom(() => {
    setIsOpenDrawerChatMembers(false);
    setIsEnableRemoveMember(false);
  });
  const { leaveRoom } = useLeaveRoom((id: string) => {
    closeChanel(data.id);
    PubSub.publish(ChatChanelEnum.CLOSE_CHAT_WINDOW, { id: data.id });
    PubSub.publish(ChatChanelEnum.ON_FRESH_DATA, { id: data.id });
  });

  //Mark seen
  const { markSeenNotifyChat } = useSeenNotifyChat();

  const getChatRoomInfo = useCallback((roomData: any) => {
    let roomInfo = {
      roomName: roomData.friend.username || roomData.friend.fullName,
      roomAvatar: roomData.friend.avatarUrl || "/images/anonymous-avatar.png",
      id: roomData.friend.id,
    };
    if (roomInfo.id === ADMIN_ID) {
      roomInfo.roomName = EMAIL_SUPPORT;
      roomInfo.roomAvatar = "/images/chat/icon-chat-cl.png";
    } else if (roomInfo.id === CHATGPT_ID) {
      roomInfo.roomName = "GPT";
      roomInfo.roomAvatar = "/images/chat/icon-chat-gpt.png";
    }
    return roomInfo;
  }, []);

  //State to enable scroll to last message
  const [isEnableScroll, setIsEnableScroll] = useState(true);
  //State enable show list member
  const [isOpenDrawerChatMembers, setIsOpenDrawerChatMembers] = useState(false);
  //State enable show change group name
  const [isShowChangeGroupName, setIsShowChangeGroupName] = useState(false);
  //State enable show add member box
  const [isShowAddMember, setIsShowAddMember] = useState(false);
  //State enable show list member and remove member
  const [isEnableRemoveMember, setIsEnableRemoveMember] = useState(false);

  useEffect(() => {
    let actions = PubSub.subscribe(ChatChanelEnum.ACTION_MENU, (mess, { id: id, action: action }) => {
      if (!!action && id === data.id) {
        switch (action) {
          case ActionChatType.EDIT_ROOMNAME:
            setIsShowChangeGroupName(true);
            break;
          case ActionChatType.ADD_MEMBERS:
            setFilterDataRoom(data.id);
            setIsShowAddMember(true);
            break;
          case ActionChatType.LEAVE:
            const onConfirm = () => {
              leaveRoom(id);
            };
            confirmAction({
              message: t("Are you sure to leave this conversation? You will not send or receive messages anymore."),
              onConfirm,
              overlayProps: {
                opacity: 0,
              },
            });
            break;
          case ActionChatType.CLEAR_CHAT:
            clearHistories(id);
            markSeenNotifyChat(id);
            break;
          case ActionChatType.REMOVE_MEMBER:
            setFilterDataRoom(data.id);
            setIsEnableRemoveMember(true);
            break;
          case ActionChatType.SHOW_MEMBERS:
            setFilterDataRoom(data.id);
            setIsOpenDrawerChatMembers(true);
            break;
        }
      }
    });
    const onChatGPTLoading = PubSub.subscribe(ChatChanelEnum.CHAT_GPT_LOADING, (message, data) => {
      setLoading(data);
    });
    return () => {
      PubSub.unsubscribe(actions);
      PubSub.unsubscribe(onChatGPTLoading);
    };
  }, [data?.id]);

  //Hide chat
  const onMinimizeChatWindow = () => {
    PubSub.publish(ChatChanelEnum.MINIMIZE_CHAT_WINDOW, { id: data.id });
  };

  //Close chat
  const onCloseChatWindow = () => {
    //Confirm textbox has content
    const isShowConfirm = ChatBoxHelper.checkConfirmCloseChatbox(data.id);
    if (isShowConfirm) {
      const onConfirm = () => {
        closeChanel(data.id);
        PubSub.publish(ChatChanelEnum.CLOSE_CHAT_WINDOW, { id: data.id });
      };
      confirmAction({
        htmlContent: (
          <span>
            {t("You haven't sent your message. Are you sure you want to close chatbox")}{" "}
            <strong>{getChatRoomInfo(data).roomName}</strong>
          </span>
        ),
        overlayProps: {
          opacity: 0,
        },
        labelConfirm: t("OK"),
        onConfirm,
      });
    } else {
      closeChanel(data.id);
      PubSub.publish(ChatChanelEnum.CLOSE_CHAT_WINDOW, { id: data.id });
    }
  };

  //Load more handle
  const loadMoreHistory = async () => {
    //Check if is the first message, no loadmore
    let firstMessage = document.querySelector(`#message-item-${messages?.[0]?.id} > .message-container`);
    if (firstMessage != null) {
      let timestamp = firstMessage.getAttribute("data-time-stamp");
      if (!!timestamp) {
        setIsEnableScroll(false);
        await loadMoreMessage(
          {
            limit: 15,
            timestamp: messages[0]?.timestamp,
            chatId: data.id,
            roomType: data.roomType,
          },
          locale
        );
      } else {
        //No more load
        let lbNomore = document.querySelector(`#chat-window-${data.id} .detail-chat > .chat-nomore-message`);
        let chatWin = document.querySelector(`#chat-window-${data.id} .detail-chat`);
        if (lbNomore == null) {
          let html = document.createElement("div");
          html.setAttribute("class", "chat-nomore-message w-full text-center text-sm mb-2");
          let textNode = document.createTextNode(t("No more load"));
          html.appendChild(textNode);
          chatWin.insertBefore(html, chatWin.childNodes[0]);
        }
      }
    }
  };

  //On close list members
  const onCloseListMembers = () => {
    setIsOpenDrawerChatMembers(false);
    setIsEnableRemoveMember(false);
  };

  //On close change group name
  const onCloseChangeGroupName = () => {
    setIsShowChangeGroupName(false);
  };

  //On change group name
  const onChangeGroupName = (newName: string) => {
    const pattern = /^(?!.*<[^>]+>).*/;
    if (!newName.match(pattern)) {
      Notify.error(t("Group name cannot be blank and does not include html."));
    } else if (newName.trim().length > 256) {
      Notify.error(t("Group name must not exceed 256 characters"));
    } else {
      // updateRoomName(FunctionBase.removeHtmlTag(newName), data.id);
      onCloseChangeGroupName();
    }
  };

  //On close add member
  const onCloseAddMember = () => {
    setIsShowAddMember(false);
  };

  //On addmember
  const onAddMember = (ids) => {
    addMemberToRoom(ids, data.id);
  };

  //On Remove member
  const onRemoveMember = (id: any, userName: any) => {
    const onConfirm = () => {
      removeMember(data.id, id);
    };
    confirmAction({
      htmlContent: (
        <div>
          <p className="font-semibold mb-2">
            {t("Are you sure to remove")} {userName} {t("from the conversation?")}
          </p>
          <span>{t("The member will able to see the previous messages.")}</span>
        </div>
      ),
      overlayProps: {
        opacity: 0,
      },
      onConfirm,
    });
  };

  return (
    <div className={styles["chat-window-item"]} id={`chat-window-${data.id}`}>
      <span className="edn-chat-count-new-message">
        <i className="la la-ellipsis-h"></i>
      </span>
      <div
        className={clsx(
          "rounded-t-lg flex items-center justify-between px-2 relative bg-white",
          styles["chatbox-header"]
        )}
      >
        <div className={`${styles["user-acc"]} flex items-center flex-grow`}>
          {/* <a
            className="w-8 h-8 rounded-full border-1 overflow-hidden"
            href="#"
            title=""
          >
            <img className="user-avatar w-full h-full object-cover" src={getChatRoomInfo(data).roomAvatar} alt="user-name" />

          </a> */}
          <Avatar
            userId={isChatGPT ? 0 : getChatRoomInfo(data).id}
            userExpLevel={null}
            size="sm"
            className="mb-1"
            src={getChatRoomInfo(data).roomAvatar}
          />
          <div
            id={`group-chat-name-${data?.id}`}
            className={`${styles["right-account"]} pl-2 overflow-ellipsis overflow-hidden`}
          >
            {isChatGPT ? (
              <span className="whitespace-nowrap text-sm font-semibold" title={getChatRoomInfo(data).roomName}>
                {getChatRoomInfo(data).roomName}
              </span>
            ) : (
              <Link href={`/profile/${getChatRoomInfo(data).id}`}>
                <span className="whitespace-nowrap text-sm font-semibold" title={getChatRoomInfo(data).roomName}>
                  {getChatRoomInfo(data).roomName}
                </span>
              </Link>
            )}
          </div>
        </div>
        <div className={`whitespace-nowrap`}>
          <ChatHeadMenu
            id={data.id}
            isActive
            type="private"
            inChatBox
            mute={data?.mute}
            isOwner={data?.ownerId == profile?.userId}
          />
          <Button
            onClick={() => onMinimizeChatWindow()}
            variant="subtle"
            className="w-8 h-8 rounded-full p-0 text-gray-primary"
          >
            <Icon name="minus" size="lg" />
          </Button>
          <Button
            onClick={() => onCloseChatWindow()}
            variant="subtle"
            className="w-8 h-8 rounded-full p-0 text-gray-primary"
          >
            <Icon name="close" size="lg" />
          </Button>
        </div>
      </div>
      <div className={clsx("container-chatbox flex-grow relative bg-white border-t h-[calc(100%_-_48px)]")}>
        {/* List members */}
        <Visible visible={isOpenDrawerChatMembers || isEnableRemoveMember}>
          <ListMembers
            roomId={data?.id}
            onRemoveMember={onRemoveMember}
            isEnableRemoveMember={isEnableRemoveMember}
            dataRoom={dataRoom}
            onCloseListMembers={onCloseListMembers}
          />
        </Visible>
        {/* Change group name */}
        <Visible visible={isShowChangeGroupName}>
          <ChangeGroupName
            onChangeGroupName={onChangeGroupName}
            roomId={data?.id}
            onCloseChangeGroupName={onCloseChangeGroupName}
          />
        </Visible>
        {/* Add member */}
        <Visible visible={isShowAddMember}>
          {/*<AddMember dataRoom={dataRoom} onAddMember={onAddMember} roomId={data?.id} onCloseAddMember={onCloseAddMember} />*/}
          <ModalAddMember
            open={true}
            dataRoom={dataRoom}
            onSubmit={onAddMember}
            roomId={data?.id}
            onClose={onCloseAddMember}
          />
        </Visible>
        <div id={`chatbox-${data.id}`} className={clsx("chatbox flex flex-col relative h-full")}>
          <DetailChat
            isPrivate
            roomId={data.id}
            isActive
            roomAvatar={getChatRoomInfo(data).roomAvatar}
            roomName={getChatRoomInfo(data).roomName}
            messages={messages}
            loadMoreHistory={loadMoreHistory}
            isEnableScroll={isEnableScroll}
            currentUserId={profile?.userId}
          />
          <ReplyArea roomId={data.id} />
          <FormSendChat reConnect={reConnect} data={data} isActive roomId={data.id} />
        </div>
      </div>
    </div>
  );
};
export default ChatWindow;
