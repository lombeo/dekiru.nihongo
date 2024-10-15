export interface ChanelProps {
  roomId: string;
  afterGetMessage?: any;
}
export enum ChatChanelEnum {
  TOGGLE_CHAT_BOX = "toggleChatBox",
  OPEN_CHAT = "openChat",
  ACTION_MENU = "actionMenu",
  ACTION_MENU_IN_SIDEBAR = "actionMenu_in_sidebar",
  IS_CLOSE_MENU = "IS_CLOSE_MENU",
  CLOSE_CHAT_WINDOW = "CLOSE_CHAT_WINDOW",
  CLOSE_ALL_CHAT_WINDOW = "CLOSE_ALL_CHAT_WINDOW",
  MINIMIZE_CHAT_WINDOW = "MINIMIZE_CHAT_WINDOW",
  REPLY_ACTION = "REPLY_ACTION",
  ON_NEW_NOTIFY = "ON_NEW_NOTIFY",
  ON_NOTIFY_CHANGE = "ON_NOTIFY_CHANGE",
  ON_FRESH_DATA = "ON_FRESH_DATA",
  MARK_SEEN = "MARK_SEEN",
  USER_ADD = "USER_ADD",
  UPDATE_CHAT_ROOM_LIST_WHEN_USER_ADD = "UPDATE_CHAT_ROOM_LIST_WHEN_USER_ADD",
  ROOM_MUTE_CONFIG_CHANGE = "ROOM_MUTE_CONFIG_CHANGE",
  RELOAD_FRIEND = "RELOAD_FRIEND",
  RELOAD_FRIEND_REQUEST = "RELOAD_FRIEND_REQUEST",
  RELOAD_FRIEND_INVITES = "RELOAD_FRIEND_INVITES",
  OPEN_CHAT_FROM_PARENT = "OPEN_CHAT_FROM_PARENT",
  SET_USER_FOCUS = "SET_USER_FOCUS",
  CHAT_GPT_LOADING = "CHAT_GPT_LOADING",
}
//Enum of type mute
export enum MuteChatEnum {
  ALL = "ALL",
  CHAT = "CHAT",
  VIDEO = "VIDEO",
  NONE = "null",
}
//Enum type of room
export enum TypeRoomChatEnum {
  PRIVATE = "Private",
  GROUP = "Group",
  CONTEXT_GROUP = "ContextGroup",
}
//Enum type of message
export enum TypeMessageChatEnum {
  TEXT = "TEXT",
  ATTACHMENT = "ATTACHMENT",
  EDIT_MESSAGE = "EDIT_MESSAGE",
  DELETE_MESSAGE = "DELETE_MESSAGE",
  REACTION = "REACTION",
  USER_SEEN_MESSAGE = "USER_SEEN_MESSAGE",
  SYSTEM_MESSAGE = "SYSTEM_MESSAGE",
  ROOM_MUTE_CONFIG_CHANGE = "ROOM_MUTE_CONFIG_CHANGE",
}
//Enum type of System message SYSTEM_MESSAGE
export enum TypeOfSystemMessageEnum {
  USERS_ADDED = "USERS_ADDED",
  USERS_REMOVED = "USERS_REMOVED",
  USERS_LEFT_ROOM = "USERS_LEFT_ROOM",
  ROOM_CREATED = "ROOM_CREATED",
  ROOM_NAME_UPDATED = "ROOM_NAME_UPDATED",
  PRIVATE_CHAT_STARTED = "PRIVATE_CHAT_STARTED",
  ROOM_OWNER_UPDATED = "ROOM_OWNER_UPDATED",
  ROOM_MUTE_CONFIG_CHANGE = "ROOM_MUTE_CONFIG_CHANGE",
}
//Enum action chat
export enum ActionChatType {
  EDIT_ROOMNAME = "edit",
  SHOW_MEMBERS = "show_members",
  ADD_MEMBERS = "add_member",
  REMOVE_MEMBER = "remove_members",
  CLEAR_CHAT = "clear_chat_histories",
  MUTE = "mute",
  UNMUTE = "unmute",
  LEAVE = "leave",
}

export enum RelationShipStatusEnum {
  None = 0,
  Requested = 1,
  BeFriend = 2,
  UnFriend = 3,
  Block = 4,
}

export enum FriendStatusEnum {
  Unknown = 0,
  Friended = 1,
  Requested = 2,
  WaitingAccept = 3,
}
export const fileExtension = {
  Image: "image",
  Word: "doc",
  Excel: "xls",
  PowerPoint: "ppt",
  Pdf: "pdf",
  Document: "doc,xls,pdf,ppt",
  Video: "video",
  Audio: "audio",
  Media: "video,audio",
  MultiMedia: "video,audio,image",
  Zip: "zip",
  Files: "video,audio,image,zip",
  Other: "other",
};

export const fileExtensionsObject = [
  {
    type: fileExtension.Image,
    accept: "image/png,image/bmp,image/gif,image/jpeg",
    maxSize: 2,
  },
  {
    type: fileExtension.Word,
    accept: ".doc,.docx",
    maxSize: 10,
  },
  {
    type: fileExtension.Excel,
    accept: ".xls,.xlsx",
    maxSize: 10,
  },
  {
    type: fileExtension.PowerPoint,
    accept: ".ppt,.pptx",
    maxSize: 10,
  },
  {
    type: fileExtension.Pdf,
    accept: ".pdf",
    maxSize: 10,
  },
  {
    type: fileExtension.Document,
    accept: ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx",
    maxSize: 10,
  },
  {
    type: fileExtension.Video,
    accept: ".mp4,.mov",
    maxSize: 50,
  },
  {
    type: fileExtension.Audio,
    accept: ".mp3,.wav",
    maxSize: 10,
  },
  {
    type: fileExtension.Media,
    accept: ".mp3,.wav,.mp4,.mov",
    maxSize: 50,
  },
  {
    type: fileExtension.MultiMedia,
    accept: ".mp3,.wav,.mp4,.mov,image/png,image/bmp,image/gif,image/jpeg",
    maxSize: 50,
  },
  {
    type: fileExtension.Zip,
    accept: ".rar",
    maxSize: 50,
  },
  {
    type: fileExtension.Files,
    accept: ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.rar,.mp4,.mov",
    maxSize: 50,
  },
];

const imgRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp))/gim;
const zipRegex = /^(https?:\/\/.*\.(?:zip|rar|7zip))/gim;
const mediaRegex = /^(https?:\/\/.*\.(?:mov|mp4|mp3|wav|flac))/gim;
const wordRegex = /^(https?:\/\/.*\.(?:doc|docx))/gim;
const excelRegex = /^(https?:\/\/.*\.(?:xls|xlsx))/gim;
const powerPointRegex = /^(https?:\/\/.*\.(?:ppt|pptx))/gim;
const pdfRegex = /^(https?:\/\/.*\.(?:pdf))/gim;

const extensionOptions = [
  {
    type: imgRegex,
    icon: "image",
    ext: fileExtension.Image,
  },
  {
    type: zipRegex,
    icon: "folder_zip",
    ext: fileExtension.Zip,
  },
  {
    type: mediaRegex,
    icon: "drawer_play",
    ext: fileExtension.Media,
  },
  {
    type: wordRegex,
    icon: "text_t",
    ext: fileExtension.Word,
  },
  {
    type: excelRegex,
    icon: "calculator_multiple",
    ext: fileExtension.Excel,
  },
  {
    type: powerPointRegex,
    icon: "presenter",
    ext: fileExtension.PowerPoint,
  },
  {
    type: pdfRegex,
    icon: "document_pdf",
    ext: fileExtension.Pdf,
  },
];

export const fileExtensionType = (url: string) => {
  const fileEx = extensionOptions.find((x: any) => url.match(x.type));
  if (!fileEx) return null;
  return fileEx;
};
