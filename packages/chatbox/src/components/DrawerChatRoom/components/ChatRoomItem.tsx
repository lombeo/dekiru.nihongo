import { ChatChanelEnum } from "@chatbox/constants";
import { useClearHistories } from "@chatbox/hook/useClearHistories";
import { useSeenNotifyChat } from "@chatbox/hook/useSeenNotifyChat";
import { TextOverflow } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { Delete } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserCircle } from "tabler-icons-react";
import styles from "../DrawerChatRoom.module.scss";

const ChatRoomItem = (props: any) => {
  const { data } = props;
  const hasNotify = data?.notifyCount > 0;
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const ref = useClickOutside(() => setShowMenu(false));
  const { markSeenNotifyChat } = useSeenNotifyChat();
  const { clearHistories } = useClearHistories();
  const profile = useSelector(selectProfile);

  const handleDeleteChat = (data: any) => {
    clearHistories(data.id);
    markSeenNotifyChat(data.id);
    setShowMenu(false);
  };

  const openChatBox = () => {
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data });
  };

  return (
    <li
      className={clsx(
        "flex items-center relative pb-2 pt-1 pl-2 hover:bg-gray-200 rounded-lg cursor-pointer",
        styles["chat-room-root"]
      )}
    >
      <div className={`${styles["wrap-user-item"]}`} onClick={openChatBox}>
        <Avatar
          userExpLevel={data.friend?.userExpLevel}
          src={data.friend?.avatarUrl || "/images/anonymous-avatar.png"}
          userId={data.friend?.userId}
          size="lg"
        />
        <div className={styles["wrap-user-info"]}>
          <div className="flex flex-col pt-1">
            <TextOverflow
              className="m-0 truncate"
              style={{ fontWeight: hasNotify ? "700" : "600" }}
              title={FunctionBase.escapeForTitleAttribute(data.friend?.username || data.friend?.fullName)}
            >
              {data.friend?.username || data.friend?.fullName}
            </TextOverflow>
          </div>
        </div>
      </div>
      <span
        className={clsx("sub-menu-btn", {
          "shadow-[0_2px_6px_rgba(0,_0,_0,_0.1)] bg-white !visible !opacity-100": showMenu,
        })}
        onClick={() => setShowMenu(!showMenu)}
      >
        <Icon name="dots-menu" />
      </span>
      {hasNotify && <span className={clsx(styles["has-notice"], "right-4 top-1/2")}></span>}
      {showMenu && (
        <ul
          ref={ref}
          className={`${styles["sub-menu"]} absolute top-[52px] right-1 t-full rounded-lg bg-white z-10 p-1 text-sm`}
        >
          <MenuItem>
            <Link
              href={`/profile/${data?.friend?.id}`}
              className="flex items-center gap-3 font-semibold p-1"
              target="_blank"
            >
              <UserCircle width={24} height={24} />
              {t("View profile")}
            </Link>
          </MenuItem>
          <MenuItem onClick={() => handleDeleteChat(data)}>
            <Tooltip label={t("Delete chat")}>
              <div className="flex items-center gap-3 text-[#E32E34] font-semibold p-1">
                <Delete width={20} height={20} />
                {t("Delete chat")}
              </div>
            </Tooltip>
          </MenuItem>
        </ul>
      )}
    </li>
  );
};

export default ChatRoomItem;

const MenuItem = (props: any) => {
  return (
    <li
      className="chat-option hover:bg-[#EEEFFA] hover:text-[#2C31CF] text-[#3B3C54] transition-all cursor-pointer px-2 py-1 rounded"
      {...props}
    />
  );
};
