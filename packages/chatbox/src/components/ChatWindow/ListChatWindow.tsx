import { useMediaQuery } from "@mantine/hooks";
import { ADMIN_ID, CHATGPT_ID } from "@src/config";
import { selectProfile } from "@src/store/slices/authSlice";
import { selectChatWindows, selectListRoomChat, selectOpenDrawerChat } from "@src/store/slices/chatSlice";
import clsx from "clsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BubleChatList from "./BubbleChat/BubbleChatList";
import ChatWindow from "./ChatWindow";
import styles from "./ChatWindow.module.scss";

const ListChatWindow = () => {
  const matchesMedium = useMediaQuery("(min-width: 768px)");

  const listRoomChat = useSelector(selectListRoomChat);
  const openDrawerChat = useSelector(selectOpenDrawerChat);
  const chatWindows = useSelector(selectChatWindows);
  const profile = useSelector(selectProfile);

  const listActiveRoom = chatWindows.flatMap((action) => {
    const room = listRoomChat?.find((e) => e.id === action.id);
    if (room) {
      return {
        ...room,
        isMinimize: action.isMinimize,
        lastActiveTime: action.lastActiveTime,
      };
    }
    return action;
  });

  useEffect(() => {
    if (matchesMedium) return;
    if (listActiveRoom.some((e) => !e.isMinimize)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [listActiveRoom]);

  return (
    <div>
      <BubleChatList
        listActiveRoom={listActiveRoom.filter(
          (item) => item.friend?.id !== CHATGPT_ID && (item.friend?.id !== ADMIN_ID || !!profile)
        )}
      />
      {listActiveRoom.length > 0 && (
        <div
          className={clsx(styles["list-chat-room"], "z-[201] fixed bottom-0 flex flex-row-reverse", {
            "md:right-[450px]": openDrawerChat,
            "md:right-[80px]": !openDrawerChat,
          })}
          style={{
            marginRight: listActiveRoom.filter((item: any) => item?.isMinimize).length > 0 ? "4rem" : "0",
          }}
        >
          {listActiveRoom
            .filter((item: any) => !item.isMinimize)
            .map((item) => (
              <ChatWindow data={item} key={item.id} />
            ))}
        </div>
      )}
    </div>
  );
};
export default ListChatWindow;
