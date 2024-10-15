import { ChatService } from "@chatbox/services/chat.service";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";

interface RoomModel {
  name?: string;
  clientKey?: string;
  members: any;
}
/**
 * useCreateRoom - Hook for create room.
 * @param props RoomModel(name, clientKey, members)
 * @returns
 */
export const useCreateRoom = (callBack?: any): any => {
  const createRoom = async (model: RoomModel) => {
    await ChatService.createRoom({
      name: FunctionBase.removeHtmlTag(model?.name),
      clientKey: model?.clientKey,
      members: model?.members.map(String),
    })
      .then((respone: any) => {
        if (callBack != null) {
          callBack(respone);
        }
      })
      .catch(() => {
        console.log("Create room failed");
      });
  };
  return { createRoom };
};
