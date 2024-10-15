import { ChatService } from "@chatbox/services/chat.service";
import { useEffect, useState } from "react";

/**
 * useGetMembersOfRoom - Hook for get member of room.
 * @param props filterProps(roomId)
 * @returns array - list members of room
 */
export const useGetMembersOfRoom = () => {
    const [dataRoom, setDataRoom] = useState([]);
    const setFilterDataRoom = (roomId) => {
        ChatService.getMembersOfRoom(roomId).then((respone: any) => {
            setDataRoom(respone.data)
        }).catch(() => {
            setDataRoom([])
        })
    }

    return { dataRoom, setFilterDataRoom }
}
