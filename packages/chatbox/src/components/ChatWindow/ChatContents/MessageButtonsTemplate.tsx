import Icon from "@edn/font-icons/icon";
import { useTranslation } from "next-i18next";
import styles from "../../ChatRoomItem/ChatItem.module.scss";
import MessageItemSubMenu from "./MessageItemSubMenu";
import PubSub from "pubsub-js";
import { ChatChanelEnum } from "@chatbox/constants";
import { selectProfile } from "@src/store/slices/authSlice";
import { useSelector } from "react-redux";

/**
 *
 * @param props
 * @returns Action buttons
 */
const MessageButtonsTemplate = (props: any) => {
  const profile = useSelector(selectProfile);
  const { t } = useTranslation();
  const data = props.message;
  const allowEdit = props.fileHtml;
  const roomId = props.roomId;
  const isPrivate = props.isPrivate;
  const handleEdit = props.handleEdit;

  //Reply handle
  const onReply = () => {
    PubSub.publish(ChatChanelEnum.REPLY_ACTION, { data, roomId });
  };

  return (
    <div
      className={`${styles["message-item-menu"]} ${data?.senderId == profile?.userId ? styles["current-user"] : ""}`}
    >
      <div onClick={() => onReply()} title={t("Reply")}>
        <Icon name="reply" />
      </div>
      {data?.senderId == profile?.userId ? (
        <MessageItemSubMenu
          handleEdit={handleEdit}
          isPrivate={isPrivate}
          roomId={roomId}
          data={data}
          allowEdit={allowEdit}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MessageButtonsTemplate;
