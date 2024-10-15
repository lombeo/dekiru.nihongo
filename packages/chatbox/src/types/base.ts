/**
 * Model data of friend
 */
export interface FriendChatData {
  id: number;
  active: boolean;
  username: string;
  fullName: string;
  avatarUrl: string;
}
/**
 * Model data for each chat element in list chat.
 */
export interface ChatModelData {
  isMinimize?: boolean;
  roomType?: string;
  active: boolean;
  ownerId: number;
  notifyCount: number;
  lastMessageTimestamp: string;
  name?: string;
  id: string;
  mute?: string;
  friend?: FriendChatData;
  lastActiveTime?: number;
}
