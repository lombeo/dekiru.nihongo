import ExternalLink from "@src/components/ExternalLink";
import { CHATGPT_ID } from "@src/config";
import { DEFAULT_AVATAR_URL } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import OnlyMessageTemplate from "./OnlyMessageTemplate";

/**
 *
 * @param props NormalMessageTemplate
 * @returns Template of normal message
 */
const NormalMessageTemplate = (props: any) => {
  const {
    data,
    isActive,
    roomName,
    roomAvatar,
    hasAvatar,
    roomId,
    isPrivate,
    isGroupMessage = true,
    showAvatarOnly = false,
  } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const isChatGPT = data.senderId === CHATGPT_ID;
  const anonymousUser = getAnonymousUser();
  const currentUserId = profile ? profile?.userId : anonymousUser?.userId;

  //Normally username to same structure
  const normallyDisplayName = (user: any) => {
    let name = "";
    try {
      if (user.id == currentUserId) {
        name = t("You");
      } else {
        name = roomName;
      }
      return { name: name };
    } catch (ex) {
      return { name: name };
    }
  };

  const renderTemplate = () => {
    if (!!data.id) {
      let wrap_css_class = "message-container mb-1 flex gap-1 inline-block message-of-" + data?.senderId;
      let isCurrentUser = false;
      let avatar: any = "",
        userName: any = "";
      try {
        if (data?.senderId == currentUserId) {
          isCurrentUser = true;
          wrap_css_class += " current-user justify-end";
        } else {
          wrap_css_class += " justify-start";
          userName = normallyDisplayName(data?.sender);
          avatar = isChatGPT ? (
            <img
              width={40}
              height={40}
              src={roomAvatar}
              className="mes-user-avatar flex-none h-7 w-7 rounded-full overflow-hidden border border-solid border-gray object-cover"
            />
          ) : (
            <ExternalLink href={`/profile/${data.senderId}`} target="_blank">
              <img
                width={40}
                height={40}
                src={roomAvatar}
                className="mes-user-avatar flex-none h-7 w-7 rounded-full overflow-hidden border border-solid border-gray object-cover"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = DEFAULT_AVATAR_URL;
                }}
              />
            </ExternalLink>
          );
          userName = isChatGPT ? (
            <h4
              className="mes-user-name text-xs font-semibold m-0 mb-1"
              title={FunctionBase.escapeForTitleAttribute(userName.account)}
              data-user-name={FunctionBase.escapeForTitleAttribute(userName.name)}
              data-user-id={data?.senderId}
            >
              {FunctionBase.htmlEncode(userName.name)}
            </h4>
          ) : (
            <ExternalLink href={`/profile/${data.senderId}`} target="_blank">
              <h4
                className="mes-user-name text-xs font-semibold m-0 mb-1"
                title={FunctionBase.escapeForTitleAttribute(userName.account)}
                data-user-name={FunctionBase.escapeForTitleAttribute(userName.name)}
                data-user-id={data?.senderId}
              >
                {FunctionBase.htmlEncode(userName.name)}
              </h4>
            </ExternalLink>
          );
        }
      } catch (ex) {
        (avatar = ""), (userName = "");
      }
      return (
        <div
          className={wrap_css_class}
          data-time-stamp={data?.timestamp}
          style={{ maxWidth: isCurrentUser ? "calc(100% - 68px)" : "calc(100% - 36px)" }}
        >
          {isGroupMessage || hasAvatar || showAvatarOnly ? avatar : <></>}
          <div className={`wrap-main-message flex flex-col items-start`}>
            {isGroupMessage || hasAvatar || showAvatarOnly ? userName : <></>}
            <div
              className={`wrap-content-message w-full flex flex-col items-start ${
                isGroupMessage || hasAvatar || showAvatarOnly ? "" : "pl-8"
              }`}
            >
              <OnlyMessageTemplate
                isPrivate={isPrivate}
                roomId={roomId}
                isCurrentUser={isCurrentUser}
                data={data}
                isActive={isActive}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  };

  return <>{renderTemplate()}</>;
};

export default NormalMessageTemplate;
