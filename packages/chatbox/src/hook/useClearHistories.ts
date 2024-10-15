import { ChatService } from "@chatbox/services/chat.service";
import { ChatChanelEnum } from "@chatbox/constants";
import PubSub from "pubsub-js";

/**
 * useClearHistories - Hook for clear histories chat.
 * @param props callBack function that excute after clear histories
 * @returns clearHistories
 */
export const useClearHistories = (onSuccess = null): any => {
  const clearHistories = async (roomId: string) => {
    await ChatService.clearHistories(roomId)
      .then((respone: any) => {
        PubSub.publish(ChatChanelEnum.CLOSE_CHAT_WINDOW, { id: roomId });
        PubSub.publish(ChatChanelEnum.ON_FRESH_DATA, { id: roomId });
        if (onSuccess != null) {
          //After clear history
          onSuccess(roomId);
        }
      })
      .catch((err) => {
        if (onSuccess != null) {
          //After clear history
          onSuccess(roomId);
        }
      });
  };
  return { clearHistories };
};
