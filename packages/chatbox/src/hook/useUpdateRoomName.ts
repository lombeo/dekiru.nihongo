import { ChatService } from "@chatbox/services/chat.service";

/**
 * useUpdateRoomName - Hook for create room.
 * @param props onSuccess, onError functions that excute after change room name
 * @returns void
 */
export const useUpdateRoomName = (onSuccess = null, onError = null): any => {

    const updateRoomName = async (value: string, id: string) => {
        await ChatService.updateRoomName(value, id).then((respone: any) => {
            if (onSuccess != null) {
                //UpdateRoomNameLabel 
                onSuccess(value);
            }
        }).catch(() => {
            if (onError != null) {
                //UpdateRoomNameLabel 
                onSuccess(value);
            }
            console.log('Update room name failed')
        })
    }
    return { updateRoomName }
}