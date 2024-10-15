import { TypeMessageChatEnum } from "@chatbox/constants";
import moment from "moment";
import { useEffect, useRef } from "react";
import MessageItemTemplate from "./MessageItemTemplate";
import { throttle } from "lodash";

const DetailChat = (props: any) => {
  const { isActive = true, roomAvatar, roomName, roomId, messages, isPrivate, loadMoreHistory, isEnableScroll } = props;
  let chatWrapper = useRef(null);
  const isLoading = useRef(false);
  const refLoadMore = useRef(loadMoreHistory);

  useEffect(() => {
    refLoadMore.current = loadMoreHistory;
  });

  const onScroll = useRef(
    throttle(async () => {
      if (chatWrapper.current && !isLoading.current) {
        const { scrollTop, scrollHeight } = chatWrapper.current;
        //Scroll to top
        const areaScroll = (1 / scrollHeight) * 200000;
        if (scrollTop < areaScroll && refLoadMore.current) {
          (window as any).debugScrollChat && console.log(scrollTop, areaScroll);
          isLoading.current = true;
          await refLoadMore.current?.();
          isLoading.current = false;
        }
      }
    }, 300)
  );

  let timestamp_temp = null;
  let sender_id_temp = 0;
  let type = TypeMessageChatEnum.SYSTEM_MESSAGE;

  return (
    <div
      id={`detail-chat-${roomId}`}
      onScroll={() => onScroll.current()}
      ref={chatWrapper}
      className="bg-[#F6F6F6] detail-chat flex-grow overflow-y-auto overflow-x-hidden p-2 pt-6"
    >
      {messages &&
        messages.length > 0 &&
        messages
          .sort((x: any, y: any) => {
            return x.timestamp < y.timestamp ? -1 : 1;
          })
          .map((item: any, idx: number) => {
            let isGroupMessage = true;
            let showAvatarOnly = true;
            let hasAvatar = true;

            if (timestamp_temp !== null) {
              let diff = moment(new Date(item?.timestamp)).diff(new Date(timestamp_temp), "milliseconds");
              isGroupMessage = diff > 1200000;
              showAvatarOnly = type == TypeMessageChatEnum.SYSTEM_MESSAGE;
              //Re assign type
              type = item.type;
            }

            if (item?.data?.type === "MESSAGE") {
              timestamp_temp = item?.timestamp;
            }
            //Check has avatar
            if (sender_id_temp == 0) {
              sender_id_temp = item?.senderId;
            } else {
              hasAvatar = item?.senderId != sender_id_temp;
              sender_id_temp = item?.senderId;
            }
            return (
              <MessageItemTemplate
                isLast={idx == messages.length - 1}
                isPrivate={isPrivate}
                roomId={roomId}
                isActive={isActive}
                data={item}
                key={item.id}
                isEnableScroll={isEnableScroll}
                showAvatarOnly={showAvatarOnly}
                isGroupMessage={isGroupMessage}
                roomAvatar={roomAvatar}
                roomName={roomName}
                hasAvatar={hasAvatar}
              />
            );
          })}
    </div>
  );
};

export default DetailChat;
