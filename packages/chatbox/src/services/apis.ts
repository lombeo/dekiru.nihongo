import { CHAT_API } from "@src/config";
import { ApiHelper } from "@src/helpers/api.helper";

export enum ChatAPIEnums {
  GET_LIST_ROOM = "/api/v4/rooms/user-rooms",
  CHAT_SOCKET_CONNECTION = "/api/v4/ws?token=",
  CHAT_SUB_PRIVATE = "/chat/private/",
  CHAT_SUB_GROUP = "/chat/room/",
  CHAT_NOTIFY_CHAT = "/notify/notify-total/",
  GET_CHAT_HISTORY_PRIVATE = "/api/v4/chat/private-messages",
  GET_CHAT_HISTORY_ROOM = "/api/v4/chat/room-messages",
  SEEN_NOTIFY = "/api/v4/notify/seen",
  ROOM_BASE_API = "/api/v4/rooms/",
  ROOM_BASE_API_CREATE = "/api/v4/rooms",
  SEARCH_ROOM = "/api/v4/rooms/user-rooms/search?query=",
}

export const ChatAPIs = ApiHelper.getListUri(CHAT_API, ChatAPIEnums);
