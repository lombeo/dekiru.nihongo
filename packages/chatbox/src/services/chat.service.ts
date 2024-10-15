import { axiosInstance } from "api/axiosInstance";
import { ChatAPIs } from "./apis";

const GET_LIST_ROOM = ChatAPIs.GET_LIST_ROOM;

interface RoomChatFilter {
  limit: number;
  offset: number;
}

interface FilterChatHistory {
  limit?: number;
  timestamp?: string;
  chatId?: string;
}

interface RoomProps {
  name?: string;
  clientKey?: string;
  members: Array<number>;
}

export class ChatService {
  //Get chat history private
  static getChatHistoryPrivate = async (filter: FilterChatHistory) => {
    return axiosInstance.post(ChatAPIs.GET_CHAT_HISTORY_PRIVATE + "?progress=false", filter);
  };

  //Seen notify chat
  static seenNotifyChat = async (roomId: string) => {
    return axiosInstance.post(ChatAPIs.SEEN_NOTIFY + "/" + roomId + "?progress=false");
  };

  //Create room
  static createRoom = async (model: RoomProps) => {
    return axiosInstance.post(ChatAPIs.ROOM_BASE_API_CREATE, model);
  };

  //Update room name
  static updateRoomName = async (value: string, id: string) => {
    return axiosInstance.post(ChatAPIs.ROOM_BASE_API + id + "/name?progress=false", value, {
      headers: { "Content-Type": "text/plain" },
    });
  };

  static addMembersToRoom = async (members: Array<string>, roomId: string) => {
    return axiosInstance.post(ChatAPIs.ROOM_BASE_API + roomId + "/members?progress=false", members);
  };

  //Search room
  static searchRoom = async (query: string, filter: any) => {
    return axiosInstance.post(ChatAPIs.SEARCH_ROOM + query, filter);
  };

  //Get members of room
  static getMembersOfRoom = async (roomId: any) => {
    return axiosInstance.get(`${ChatAPIs.ROOM_BASE_API}${roomId}?progress=false`);
  };

  static removeMemberFromRoom = async (roomId: string, userId: any) => {
    return axiosInstance.delete(`${ChatAPIs.ROOM_BASE_API}${roomId}/members?progress=false`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: userId,
    });
  };

  static leaveRoom = async (roomId: string) => {
    return axiosInstance.delete(`${ChatAPIs.ROOM_BASE_API}${roomId}/leave?progress=false`);
  };

  static muteChat = async (roomId: string, type: string) => {
    return axiosInstance.post(`${ChatAPIs.ROOM_BASE_API}${roomId}/mute?type=${type}&progress=false`);
  };

  static unmuteChat = async (roomId: string) => {
    return axiosInstance.post(`${ChatAPIs.ROOM_BASE_API}${roomId}/unmute?progress=false`);
  };

  static clearHistories = async (roomId: string) => {
    return axiosInstance.delete(`${ChatAPIs.ROOM_BASE_API}${roomId}/delete-chat?progress=false`);
  };
}
