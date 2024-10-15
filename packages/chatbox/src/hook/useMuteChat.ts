import { ChatService } from "@chatbox/services/chat.service";

/**
 * usemuteChat - Hook for mute a member from a chat.
 * @param props callBack function that excute after mute a member
 * @returns muteChat
 */
export const usemuteChat = (onSuccess = null): any => {
    const muteChat = async (roomId: string, type = 'CHAT') => {
        await ChatService.muteChat(roomId, type).then((respone: any) => {
            if (respone) {
                if (onSuccess != null) {
                    onSuccess();
                }
            }
        }).catch(() => {
            console.log('Mute member failed')
        })
    }
    return { muteChat }
}