import { axiosInstance } from "@src/api/axiosInstance";
import { NOTIFY_API } from "@src/config";

export class NotifyService {
  static getHistories = async (params: any) => {
    return axiosInstance.get(NOTIFY_API + "/api/v1/notify", {
      params: {
        ...params,
        progress: false,
      },
    });
  };
  static markRead = async (id: any) => {
    return axiosInstance.get(NOTIFY_API + `/api/v1/notify/read/${id}`, {
      params: {
        progress: false,
      },
    });
  };
  static markSeen = async (params: any) => {
    return axiosInstance.get(NOTIFY_API + "/api/v1/notify/seen", {
      params: {
        ...params,
        progress: false,
      },
    });
  };
  static getCountByChanel = async (params: any) => {
    return axiosInstance.get(NOTIFY_API + "/api/v1/notify/count-unread", {
      params: {
        ...params,
        progress: false,
      },
    });
  };

  static markReadByChanel = async (params: any) => {
    return axiosInstance.get(NOTIFY_API + "/api/v1/notify/read-by-channel", {
      params: {
        ...params,
        progress: false,
      },
    });
  };
}
