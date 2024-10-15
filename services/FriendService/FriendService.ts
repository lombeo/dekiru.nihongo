import { axiosInstance } from "@src/api/axiosInstance";
import { FRIEND_API } from "@src/config";

export class FriendService {
  static getChatRoomsV2 = async (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/user-rooms", data, {
      headers: {
        errorHandle: false,
      },
    });
  };

  static addFriend = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/add-friend?progress=false", data);
  };

  static relationshipChatToken = (recaptcha?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/chat-token?progress=false", {
      headers: {
        recaptcha,
      },
    });
  };

  static unFriend = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/un-friend?progress=false", data);
  };

  static acceptFriend = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/accept-friend?progress=false", data);
  };

  static cancelFriend = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/cancel-friend?progress=false", data);
  };

  static rejectFriend = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/reject-friend?progress=false", data);
  };

  static listFriend = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/list-friend?progress=false", { params });
  };

  static listFriendInvites = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/list-friend-requested?progress=false", { params });
  };

  static listFriendReceived = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/list-friend-received?progress=false", { params });
  };

  static searchUser = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/search-users?progress=false", { params });
  };

  static getUserRelationshipSettingById = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/setting/get-user-relationship-setting-by-id", {
      params,
    });
  };

  static getUserRelationshipSetting = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/setting/get-user-relationship-setting", {
      params,
    });
  };

  static createUserRelationshipSetting = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/setting/create-user-relationship-setting", data);
  };

  static updateUserRelationshipSetting = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/setting/update-user-relationship-setting", data);
  };

  static getFriendStatus = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/relationship/get-friend-status?progress=false", {
      params,
    });
  };
  static chatPushMessage = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/chatgpt/push-message?progress=false", data);
  };
  static getAllChatGptSettings = (params?: any) => {
    return axiosInstance.get(FRIEND_API + "/chatgpt/get-all-chatgpt-setting", {
      params,
    });
  };
  static createChatGptSettings = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/chatgpt/create-setting", data);
  };
  static updateChatGPTSettings = (data: any) => {
    return axiosInstance.put(FRIEND_API + "/chatgpt/update-setting", data);
  };

  static listSuggestFriend = (data: any) => {
    return axiosInstance.post(FRIEND_API + "/relationship/list-suggest-friend?progress=false", data);
  };
}
