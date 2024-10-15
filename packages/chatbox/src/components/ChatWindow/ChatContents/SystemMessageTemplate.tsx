import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import styles from "../ChatWindow.module.scss";

/**
 *
 * @param props message item
 * @returns System message template
 */

const MessageNoticeTemplate = (data, notice: any) => {
  const profile = useSelector(selectProfile);
  const { t } = useTranslation();

  //Normally display name
  const NormallyDisplayName = (user: any) => {
    let name = "",
      acc = "";
    try {
      if (user.id == profile?.userId) {
        name = t("You");
        acc = t("You");
      } else {
        name = !!user.fullName ? user.fullName : user.username;
        acc = !!user.username ? user.username : name;
      }
      return { name: name, account: acc };
    } catch (ex) {
      return { name: name, account: acc };
    }
  };

  //Main function
  let cssClass = "message-container message-notice";
  let userName = NormallyDisplayName(data.sender);
  let displayName = !!userName.name ? userName.name : userName.account;
  let user = (
    <span className={`${styles["mes-user-name"]} font-semibold`} title={`${userName.name} (${userName.account})`}>
      {displayName}
    </span>
  );
  let type = data.data === undefined ? "DELETE" : data.data.type;
  let message = data.data === undefined ? null : data.data.message;
  let timeStamp = data.timestamp;
  switch (type) {
    case "USERS_ADDED":
      cssClass += " user-added";
      if (message.members.length > 1) {
        notice = (
          <>
            {t("added")}{" "}
            <span
              className={`${styles["mes-user-name"]} font-semibold`}
              title={message.members.length + " " + t("members")}
            >
              {" "}
              {message.members.length} {t("members")}{" "}
            </span>{" "}
            {t("to group")}
          </>
        );
      } else {
        let user = message.members[0];
        user = NormallyDisplayName(user);
        notice = (
          <>
            {t("added")}{" "}
            <span className={`${styles["mes-user-name"]} font-semibold`} title={`${user.name} (${user.account})`}>
              {" "}
              {user.name}{" "}
            </span>{" "}
            {t("to group")}
          </>
        );
      }
      break;
    case "USERS_REMOVED":
      cssClass += " user-removed";
      if (message.members.length > 1) {
        notice = (
          <>
            {t("removed")}{" "}
            <span className={`${styles["mes-user-name"]} font-semibold`}>
              {" "}
              {message.members.length} {t("members")}{" "}
            </span>{" "}
            {t("from the group")}
          </>
        );
      } else {
        let user = message.members[0];
        user = NormallyDisplayName(user);
        notice = (
          <>
            {t("removed")}{" "}
            <span className={`${styles["mes-user-name"]} font-semibold`} title={`${user.name} (${user.account})`}>
              {" "}
              {user.name}{" "}
            </span>{" "}
            {t("from the group")}
          </>
        );
      }
      break;
    case "USERS_LEFT_ROOM":
      cssClass += " user-left-room";
      notice = t("left the group");
      if (message != null && message.newOwner != null) {
        let user = NormallyDisplayName(message.newOwner);
        let is_newLeader = message.newOwner.id == profile?.userId ? t("ARE_NEW_OWNER") : t("IS_NEW_OWNER");
        let title = message.newOwner.id == profile?.userId ? user.name : user.name + " (" + user.account + ")";
        notice = (
          <>
            {t("left the group")}.{" "}
            <span className={`${styles["mes-user-name"]} font-semibold`} title={title}>
              {user.name}
            </span>{" "}
            {is_newLeader}
          </>
        );
      }
      break;
    case "ROOM_NAME_UPDATED":
      cssClass += " room-updated";
      notice = (
        <>
          <span>{t("named the group")} </span>
          <span className={`${styles["mes-user-name"]} font-semibold`} title={message?.newName}>
            {message?.newName}
          </span>
        </>
      );
      break;
    default:
      timeStamp = "";
      break;
  }
  return (
    <div className={`${cssClass} text-center flex justify-center`} data-time-stamp={timeStamp}>
      <div
        className={`message-notice-content flex items-center justify-center gap-1 flex-wrap text-xs my-2 bg-gray-300 ${
          notice == "" ? " hidden" : ""
        }`}
        style={{ padding: "5px 10px", borderRadius: "25px" }}
      >
        {user} {notice}
      </div>
    </div>
  );
};

const SystemMessageTemplate = (props: any) => {
  const { data } = props;
  const { t } = useTranslation();

  const renderMessage = () => {
    //Subtype message
    const type = data.data === undefined ? "DELETE" : data?.data?.type;
    switch (type) {
      case "PRIVATE_CHAT_STARTED":
        return MessageNoticeTemplate(data, "");
      case "ROOM_CREATED":
        return MessageNoticeTemplate(data, t(" created the group"));
      default:
        return MessageNoticeTemplate(data, undefined);
    }
  };
  return <>{renderMessage()}</>;
};

export default SystemMessageTemplate;
