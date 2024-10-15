import { ChatService } from "@chatbox/services/chat.service";
import { ChatChanelEnum } from "@chatbox/constants";
import PubSub from "pubsub-js";

/**
 * useLeaveRoom - Hook for leave a room.
 * @param props callBack function that excute after leave the room
 * @returns removefunction
 */
export const useLeaveRoom = (onSuccess = null): any => {
  const leaveRoom = async (roomId: string) => {
    await ChatService.leaveRoom(roomId)
      .then((respone: any) => {
        PubSub.publish(ChatChanelEnum.CLOSE_CHAT_WINDOW, { id: roomId });
        PubSub.publish(ChatChanelEnum.ON_FRESH_DATA, { id: roomId });
        if (respone) {
          if (onSuccess != null) {
            onSuccess(roomId);
          }
        }
      })
      .catch(() => {
        console.log("Leave room failed");
      });
  };
  return { leaveRoom };
};
