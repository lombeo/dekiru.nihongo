import { ActionChatType, ChatChanelEnum } from "@chatbox/constants";
import Icon from "@edn/font-icons/icon";
import { useClickOutside } from "@mantine/hooks";
import { Delete } from "@src/components/Svgr/components";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import styles from "./ChatItem.module.scss";

interface ChatHeadMenuProp {
  id: string;
  type: string;
  isOwner?: boolean;
  isActive: boolean;
  mute?: string;
  inChatBox?: boolean;
  isLast?: boolean;
  isRefreshItem?: boolean;
  visible?: boolean;
}

interface MenuItemProps {
  id?: string;
  action: string;
  inChatBox: boolean;
}

const MenuItem = (props: any) => {
  const { action, id, inChatBox = false } = props;
  //Click to an action
  const chatAction = (id: string, action: string) => {
    if (inChatBox) {
      PubSub.publish(ChatChanelEnum.ACTION_MENU, { id: id, action: action });
    } else {
      PubSub.publish(ChatChanelEnum.ACTION_MENU_IN_SIDEBAR, { id: id, action: action });
    }
  };
  return (
    <li
      className="chat-option hover:bg-[#EEEFFA] hover:text-[#2C31CF] text-[#3B3C54] transition-all cursor-pointer px-2 py-1 rounded"
      onClick={() => chatAction(id, action)}
      {...props}
    />
  );
};
/**
 * Display menu for each chat item
 * @param props: ChatHeadMenuProp
 * @return List menu for chat element follow rule and chat type.
 */
const ChatHeadMenu = (props: ChatHeadMenuProp) => {
  const {
    id,
    type = "private",
    isOwner = false,
    mute = "",
    isActive = true,
    inChatBox = true,
    isLast,
    isRefreshItem,
    visible = true,
  } = { ...props };
  const [showMenu, setShowMenu] = useState(false);
  const [_mute, setMute] = useState(mute);
  useEffect(() => {
    if (isRefreshItem) {
      setShowMenu(false);
    }
    let actions = PubSub.subscribe(ChatChanelEnum.IS_CLOSE_MENU, (mess, { id: chatId }) => {
      if (id == chatId) {
        setShowMenu(false);
      }
    });
    return () => {
      PubSub.unsubscribe(actions);
    };
  }, [id, isActive, isRefreshItem, mute]);

  const ref = useClickOutside(() => setShowMenu(false));
  const { t } = useTranslation();
  const groupChatAction = () => {
    let ownerMenu = (
      <>
        <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.EDIT_ROOMNAME}>
          {t("Change group name")}
        </MenuItem>
        <MenuItem inChatBox={inChatBox} id={id} caction={ActionChatType.SHOW_MEMBERS}>
          {t("List members")}
        </MenuItem>
        <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.ADD_MEMBERS}>
          {t("Add member")}
        </MenuItem>
        <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.REMOVE_MEMBER}>
          {t("Remove member")}
        </MenuItem>
      </>
    );

    return (
      <>
        {isOwner ? (
          ownerMenu
        ) : type.toLocaleLowerCase() != "contextgroup" ? (
          <>
            <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.EDIT_ROOMNAME}>
              {t("Change group name")}
            </MenuItem>
            <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.SHOW_MEMBERS}>
              {t("List members")}
            </MenuItem>
            <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.ADD_MEMBERS}>
              {t("Add member")}
            </MenuItem>
          </>
        ) : (
          <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.SHOW_MEMBERS}>
            {t("List members")}
          </MenuItem>
        )}
      </>
    );
  };

  const menuChat = () => {
    return (
      <ul
        ref={ref}
        className={clsx(
          "list-chat-options absolute top-11 right-1 t-full rounded bg-white z-10 p-1 text-sm",
          styles["sub-menu"]
        )}
      >
        {inChatBox && <>{type !== "private" && groupChatAction()}</>}
        {type && type.toLocaleLowerCase() != "contextgroup" && type.toLocaleLowerCase() != "private" && (
          <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.LEAVE}>
            {t("Leave")}
          </MenuItem>
        )}
        {/*{inChatBox && (*/}
        {/*  <>*/}
        {/*    {_mute != "" && _mute != MuteChatEnum.NONE ? (*/}
        {/*      <MenuItem*/}
        {/*        inChatBox={inChatBox}*/}
        {/*        id={id}*/}
        {/*        label={t("Unmute")}*/}
        {/*        action={ActionChatType.UNMUTE}*/}
        {/*      />*/}
        {/*    ) : (*/}
        {/*      <MenuItem*/}
        {/*        inChatBox={inChatBox}*/}
        {/*        id={id}*/}
        {/*        label={t("Mute")}*/}
        {/*        action={ActionChatType.MUTE}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </>*/}
        {/*)}*/}
        <MenuItem inChatBox={inChatBox} id={id} action={ActionChatType.CLEAR_CHAT}>
          <div className="flex items-center gap-3 font-semibold p-1">
            <Delete width={20} height={20} />
            {t("Delete chat")}
          </div>
        </MenuItem>
      </ul>
    );
  };
  const menuChatControl = () => {
    if (!isActive) {
      return;
    }
    return (
      <span
        className={clsx(
          "rounded-full hover:bg-[#EEEFFA] transition-colors w-8 h-8 inline-flex cursor-pointer items-center justify-center",
          {
            "bg-gray-200": showMenu,
          }
        )}
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <Icon name="dots-menu" />
      </span>
    );
  };

  if (!visible) return <></>;

  return (
    <>
      {menuChatControl()}
      {showMenu && menuChat()}
    </>
  );
};
export default ChatHeadMenu;
