import { ChatService } from "@chatbox/services/chat.service";

/**
 * useAddMembersToRoom - Hook for add members to room.
 * @param props callBack function after add member to room
 * @returns
 */
export const useAddMembersToRoom = (onSuccess = null): any => {
  const addMemberToRoom = async (members: Array<string>, roomId: string) => {
    await ChatService.addMembersToRoom(members, roomId)
      .then((respone: any) => {
        if (onSuccess != null) {
          onSuccess();
        }
      })
      .catch(() => {
        console.log("Add member to room failed");
      });
  };
  return { addMemberToRoom };
};
