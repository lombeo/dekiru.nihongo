import { ChatChanelEnum } from "@chatbox/constants";
import { useGetChatList } from "@chatbox/hook/useGetChatList";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Drawer, Image, ScrollArea } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "@src/components/Link";
import EmptyChat from "@src/components/Svgr/components/EmptyChat";
import { ADMIN_ID, CHATGPT_ID } from "@src/config";
import { EMAIL_SUPPORT } from "@src/constants/contact.constant";
import { useProfileContext } from "@src/context/Can";
import {
  selectFetched,
  selectHasMoreRoomChat,
  selectListRoomChat,
  selectOpenDrawerChat,
  setOpenDrawerChat,
} from "@src/store/slices/chatSlice";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchFriend from "./../Search/SearchFriend";
import styles from "./DrawerChatRoom.module.scss";
import ChatRoomItem from "./components/ChatRoomItem";
import FriendList from "./components/FriendList";

const DrawerChatRoom = () => {
  const { t } = useTranslation();

  const matchesMedium = useMediaQuery("(min-width: 768px)");
  const openDrawerChat = useSelector(selectOpenDrawerChat);

  const dispatch = useDispatch();
  const fetched = useSelector(selectFetched);
  const listRoomChat = useSelector(selectListRoomChat);
  const { profile } = useProfileContext();
  const { refetch, seeMoreRoomChat, loading } = useGetChatList();
  const hasMoreRoomChat = useSelector(selectHasMoreRoomChat);

  const [showTabFriend, setShowTabFriend] = useState(false);

  const roomChatAdmin = listRoomChat?.find((e) => e.friend?.id === ADMIN_ID);
  const chatAdminCount = roomChatAdmin?.notifyCount || 0;
  const roomChatGPT = listRoomChat?.find((e) => e.friend?.id === CHATGPT_ID);
  const chatGPTCount = roomChatGPT?.notifyCount || 0;

  const router = useRouter();
  const { locale } = router;

  const handleToggleFriend = (showFriend: boolean) => {
    if (showFriend) {
      // PubSub.publish(ChatChanelEnum.RELOAD_FRIEND_REQUEST);
      // PubSub.publish(ChatChanelEnum.RELOAD_FRIEND_INVITES);
      // PubSub.publish(ChatChanelEnum.RELOAD_FRIEND);
    } else {
      refetch();
    }
    setShowTabFriend(showFriend);
  };

  const handleChatAdmin = () => {
    const userId = ADMIN_ID;
    const dataChatBox = {
      id: userId > profile?.userId ? `${profile?.userId}_${userId}` : `${userId}_${profile?.userId}`,
      lastMessageTimestamp: new Date(),
      friend: {
        id: userId,
        username: EMAIL_SUPPORT,
        fullName: EMAIL_SUPPORT,
        avatarUrl: "/images/chat/icon-chat-cl.png",
      },
      ownerId: -1,
      notifyCount: 0,
    };
    handleOpenChatBox(dataChatBox);
  };

  const handleChatGPT = () => {
    if (!profile?.userId) return;

    if (!isHaveChatGPT) {
      Notify.warning(t("The feature is being offered in beta to a group of contributors"));
      return;
    }

    const userId = CHATGPT_ID;
    const dataChatBox = {
      id: userId > profile.userId ? `${profile.userId}_${userId}` : `${userId}_${profile.userId}`,
      lastMessageTimestamp: new Date(),
      friend: {
        id: userId,
        username: "Chat GPT",
        fullName: "Chat GPT",
        avatarUrl: "/images/chat/icon-chat-gpt.png",
      },
      ownerId: -1,
      notifyCount: 0,
    };
    handleOpenChatBox(dataChatBox);
  };

  const handleOpenChatBox = (data: any) => {
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data });
  };

  const isHaveChatGPT = listRoomChat?.some((e) => e.friend?.userId === CHATGPT_ID);

  return (
    <>
      <Drawer
        size={380}
        opened={openDrawerChat}
        lockScroll={!matchesMedium}
        onClose={() => dispatch(setOpenDrawerChat(false))}
        withinPortal
        transitionProps={{
          transition: "fade",
        }}
        position="right"
        classNames={{
          content: "h-[calc(100vh_-_76px)] shadow-2xl mt-[60px] mr-4 mb-10 rounded-lg",
          title: "mr-0",
          body: "mr-0 p-0",
          overlay: "bg-transparent",
          header: "m-0 block relative p-0",
          close: "hidden",
        }}
        title={""}
      >
        <ScrollArea classNames={{ root: "h-[calc(100vh_-_76px)] max-w-full" }}>
          <div className="bg-white w-[380px] overflow-x-hidden">
            <div className="flex items-center gap-6 px-5 mr-3 pb-2 pt-4">
              <h3
                onClick={() => handleToggleFriend(false)}
                className={clsx(
                  "hover:text-blue-primary transition-all duration-300 cursor-pointer font-semibold text-lg m-0 relative",
                  {
                    "text-blue-primary": !showTabFriend,
                  }
                )}
              >
                {t("Message")}
                <div className={clsx(styles["underline"], { "!block": !showTabFriend })}></div>
              </h3>
              <div
                onClick={() => handleToggleFriend(true)}
                className={clsx(
                  "hover:text-blue-primary transition-all duration-300 cursor-pointer font-semibold text-lg m-0 relative",
                  {
                    "text-blue-primary": showTabFriend,
                  }
                )}
              >
                <div className={clsx(styles["underline"], { "!block": showTabFriend })}></div>
                {t("Friends")}
              </div>
            </div>
            <div className={styles.wrapper} id="chat-group">
              <SearchFriend />
              {!showTabFriend && (
                <>
                  {profile?.userId !== ADMIN_ID && (
                    <div onClick={handleChatAdmin} className="mt-4 px-5 flex justify-center cursor-pointer relative">
                      <Image src={`/images/chat/bg-support-${locale}.png`} className="max-w-full" />
                      {chatAdminCount > 0 && (
                        <div className="text-xs font-[800] z-10 text-[#fff] bg-[#f1646c] rounded-full absolute right-7 top-1.5 flex items-center justify-center min-w-[18px] px-1 h-[18px]">
                          {chatAdminCount > 9 ? "9+" : chatAdminCount}
                        </div>
                      )}
                    </div>
                  )}
                  <div onClick={handleChatGPT} className="mt-4 px-5 flex justify-center cursor-pointer relative">
                    <Image src={`/images/chat/bg-chatgpt-${locale}.png`} className="max-w-full" />
                    {chatGPTCount > 0 && (
                      <div className="text-xs font-[800] z-10 text-[#fff] bg-[#f1646c] rounded-full absolute right-7 top-1.5 flex items-center justify-center min-w-[18px] px-1 h-[18px]">
                        {chatGPTCount > 9 ? "9+" : chatGPTCount}
                      </div>
                    )}
                  </div>
                  {fetched && (
                    <div
                      className={clsx(styles.roomList, {
                        isHaveChatSupport: profile?.userId !== ADMIN_ID,
                        isHaveChatGPT,
                      })}
                    >
                      {listRoomChat && listRoomChat.length > 0 ? (
                        <>
                          <ul className="flex flex-col border-t mx-5 pt-2 gap-1 none-list my-4">
                            {listRoomChat
                              .filter(
                                (item: any) => item.friend?.userId !== CHATGPT_ID && item.friend?.userId !== ADMIN_ID
                              )
                              .map((item: any) => (
                                <ChatRoomItem key={item.id} data={item} />
                              ))}
                          </ul>
                          {hasMoreRoomChat && !loading && (
                            <div className="cursor-pointer p-2 hover:underline text-center" onClick={seeMoreRoomChat}>
                              {t("See more")}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-[#65656D] text-center pt-10 pb-6">
                          <EmptyChat height={200} width={305} />
                          <div className="mt-5">{t("You don't have any mailbox yet")}</div>
                          <Link href="/friend">
                            <div className="text-[#65656D]">
                              <Trans i18nKey="CONNECT_WITH_YOUR_FRIEND" t={t}>
                                Connect with your friends <span className="text-[#2C31CF] underline">here</span>
                              </Trans>
                            </div>
                          </Link>
                        </div>
                      )}
                      {/*<FriendList />*/}
                    </div>
                  )}
                </>
              )}
              {showTabFriend && (
                <div className="flex-grow overflow-y-auto pb-4">
                  <FriendList />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </Drawer>
    </>
  );
};
export default DrawerChatRoom;
