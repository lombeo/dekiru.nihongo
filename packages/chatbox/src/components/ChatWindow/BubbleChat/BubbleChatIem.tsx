import { ChatChanelEnum } from "@chatbox/constants";
import { useCloseChanel } from "@chatbox/hook/useChatSocket";
import Icon from "@edn/font-icons/icon";
import { clsx, Image } from "@mantine/core";
import { ADMIN_ID } from "@src/config";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import styles from "../ChatWindow.module.scss";

/**
 * An bubble chat item
 * @param props data
 * @returns An bubble chat item
 */
const BubbleChatIem = (props: any) => {
  const { data, isShowMoreItem = false } = props;
  const { t } = useTranslation();

  const hasNotify = data?.notifyCount > 0;
  const { closeChanel } = useCloseChanel();

  //Close chat
  const closeChatWindow = (id: string) => {
    closeChanel(id);
    PubSub.publish(ChatChanelEnum.CLOSE_CHAT_WINDOW, { id: id });
  };

  //Open chat
  const openChatBox = () => {
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data: data });
  };

  const roomName = data?.friend?.username || data?.friend?.fullName;

  let roomNameEscape = FunctionBase.escapeForTitleAttribute(roomName);

  if (data.friend?.id === ADMIN_ID) {
    roomNameEscape = t("Chat with Dekiru");
  }

  return (
    <div
      className={
        isShowMoreItem ? `${styles["bubble-chat-show-more"]}` : `${styles["bubble-chat-item"]} bg-white relative`
      }
    >
      <div
        data-tooltip-id="global-tooltip"
        data-tooltip-content={roomNameEscape}
        data-tooltip-place="top"
        onClick={() => openChatBox()}
        className={clsx(styles["bubble-chat-item__name"], {})}
      >
        {data.friend?.id === ADMIN_ID ? (
          <Image alt="" src="/images/chat/icon-chat-cl.png" fit="cover" height={48} width={48} />
        ) : (
          <span>{roomName}</span>
        )}
      </div>
      <span
        onClick={() => closeChatWindow(data?.id)}
        className={`${styles["bubble-chat-item__btn-close"]} hover:bg-danger hover:text-white`}
      >
        <Icon size={18} name="close" />
      </span>
      {hasNotify && !isShowMoreItem && <span className={`${styles["bubble-chat-item__fleg-mess"]} bg-danger`}></span>}
    </div>
  );
};

export default BubbleChatIem;
