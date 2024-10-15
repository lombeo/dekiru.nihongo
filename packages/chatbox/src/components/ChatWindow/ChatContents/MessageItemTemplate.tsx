import { TypeMessageChatEnum } from "@chatbox/constants";
import { getAnonymousUser } from "@src/hooks/useJwtToken";
import { selectProfile } from "@src/store/slices/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import NormalMessageTemplate from "./NormalMessageTemplate";
import SystemMessageTemplate from "./SystemMessageTemplate";

/**
 *
 * @param props MessageItemTemplateProps
 * @returns message item
 */
const TimeTemplate = (props: any) => {
  const { data, isGroupMessage } = props;
  if (isGroupMessage) {
    return (
      <div className="text-xs text-center mt-2 mb-2 min-w-full">
        {new Date(data.timestamp).toLocaleString()}
        <br></br>
      </div>
    );
  } else {
    return <></>;
  }
};
const MessageItemTemplate = (props: any) => {
  const {
    data,
    isLast,
    isActive,
    roomId,
    isPrivate,
    isEnableScroll = true,
    isGroupMessage = true,
    hasAvatar = false,
    showAvatarOnly = false,
    roomAvatar,
    roomName,
  } = props;

  const profile = useSelector(selectProfile);
  const anonymousUser = getAnonymousUser();
  const currentUserId = profile ? profile?.userId : anonymousUser?.userId;
  const isCurrentUser = data?.senderId == currentUserId;

  useEffect(() => {
    const lastMess = document.querySelector(`.last-message-${roomId}`);
    if (isEnableScroll && lastMess != null) {
      lastMess.scrollIntoView();
    }
  }, [isEnableScroll]);

  const getTemplate = () => {
    //System notice
    if (data?.type == TypeMessageChatEnum.SYSTEM_MESSAGE) {
      return <SystemMessageTemplate isActive={isActive} data={data} />;
    }
    //Private chat messsage
    else {
      return (
        <>
          <TimeTemplate data={data} isGroupMessage={isGroupMessage} />
          <NormalMessageTemplate
            showAvatarOnly={showAvatarOnly}
            hasAvatar={hasAvatar}
            roomAvatar={roomAvatar}
            roomName={roomName}
            isGroupMessage={isGroupMessage}
            isPrivate={isPrivate}
            roomId={roomId}
            isActive={isActive}
            data={data}
          />
        </>
      );
    }
  };

  return (
    <div
      id={`message-item-${data?.id}`}
      className={`message-wrap-item flex-wrap ${
        isCurrentUser && data?.type != TypeMessageChatEnum.SYSTEM_MESSAGE ? "flex justify-end" : ""
      } ${isLast ? `last-message-${roomId}` : ""}`}
    >
      {getTemplate()}
    </div>
  );
};

export default MessageItemTemplate;
