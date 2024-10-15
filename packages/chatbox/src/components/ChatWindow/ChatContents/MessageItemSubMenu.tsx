import { ChatBoxHelper } from "@chatbox/helper/functions-base.helper";
import { useSendMessage } from "@chatbox/hook/useChatSocket";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { PubsubTopic } from "@src/constants/common.constant";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import styles from "../../ChatRoomItem/ChatItem.module.scss";

/**
 * Submenu of message item
 * @returns Sub menu layout
 */
const MessageItemSubMenu = (props: any) => {
  const { t } = useTranslation();
  const { data, allowEdit, roomId, isPrivate, handleEdit } = props;
  const profile = useSelector(selectProfile);
  const { sendMessage } = useSendMessage();

  //Send message handle
  const actionMessage = async (currentRoomId, messageInfo) => {
    if (window?.navigator && !window.navigator.onLine) {
      Notify.warning(t("Internet connection is interrupted. Please try again!"));
      PubSub.publish(PubsubTopic.CONNECT_CHAT_SOCKET);
      return;
    }
    sendMessage(currentRoomId, messageInfo);
  };

  //Confirm delete
  const confirmDelete = () => {
    const onConfirm = () => {
      handleDeleteMessage();
    };
    confirmAction({
      message: t("Are you sure delete this message"),
      onConfirm,
      overlayProps: {
        opacity: 0,
      },
    });
  };

  // On edit
  const onEdit = () => {
    handleEdit && handleEdit();
    //Disable button
    let buttonUpload = document.getElementById(`chat-upload-btn-${roomId}`);
    if (buttonUpload != null) {
      buttonUpload.classList.add("btn-disabled");
    }
  };

  //Handle delete
  const handleDeleteMessage = () => {
    const anonymousUser = getAnonymousUser();
    const currentUserId = profile ? profile?.userId : anonymousUser?.userId;
    if (!currentUserId) return;
    let messageDelete = ChatBoxHelper.MessageData(
      data?.id,
      "DELETE_MESSAGE",
      null,
      null,
      null,
      isPrivate,
      currentUserId
    );
    actionMessage(roomId, messageDelete).then(function () {
      //After delete, need update here
    });
  };

  return (
    <div className={styles["submenu-wrap"]}>
      <Icon name="dots-menu" />
      <div className={styles["submenu-content"]}>
        {allowEdit ? (
          <div onClick={() => onEdit()} title={t("Edit")}>
            {t("Edit")}
          </div>
        ) : (
          <></>
        )}
        <div onClick={() => confirmDelete()} title={t("Delete")}>
          {t("Delete")}
        </div>
      </div>
    </div>
  );
};

export default MessageItemSubMenu;
