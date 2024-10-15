import { ChatService } from "@chatbox/services/chat.service";
import { ChatChanelEnum } from "@chatbox/constants";
import PubSub from "pubsub-js";

/**
 * useSeenNotifyChat - Hook for set seen notify chat.
 * @param props roomId
 * @returns
 */
export const useSeenNotifyChat = (onSuccess = null): any => {
  const markSeenNotifyChat = async (roomId: string) => {
    await ChatService.seenNotifyChat(roomId)
      .then(() => {
        PubSub.publish(ChatChanelEnum.ON_FRESH_DATA, { data: { id: roomId } });
        if (onSuccess != null) {
          onSuccess();
        }
      })
      .catch(() => {
        console.log("Mark seen notify failed");
      });
  };
  return { markSeenNotifyChat };
};
