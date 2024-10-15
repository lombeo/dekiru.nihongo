import { ChatService } from "@chatbox/services/chat.service";

/**
 * useRemoveMemberFromRoom - Hook for remove member from room.
 * @param props callBack function that excute after remove member
 * @returns removefunction
 */
export const useRemoveMemberFromRoom = (callBack = null): any => {
    const removeMember = async (roomId: string, userId: any) => {
        await ChatService.removeMemberFromRoom(roomId, [userId]).then((respone: any) => {
            if (respone) {
                if (callBack != null) {
                    //After remove member
                    callBack();
                }
            }
        }).catch(() => {
            console.log('Remove member failed')
        })
    }
    return { removeMember }
}