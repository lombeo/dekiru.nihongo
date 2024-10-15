import { ChatService } from "@chatbox/services/chat.service";

/**
 * useUnmuteChat - Hook for unmute member.
 * @param props callBack function that excute after unmute a member
 * @returns unmuteChat
 */
export const useUnmuteChat = (onSuccess = null): any => {
    const unmuteChat = async (roomId: string) => {
        await ChatService.unmuteChat(roomId).then((respone: any) => {
            if (respone) {
                if (onSuccess != null) {
                    onSuccess();
                }
            }
        }).catch(() => {
            console.log('Unmute member failed')
        })
    }
    return { unmuteChat }
}