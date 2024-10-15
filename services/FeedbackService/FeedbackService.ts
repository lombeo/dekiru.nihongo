import { axiosInstance } from "@src/api/axiosInstance";
import { FEEDBACK_API } from "@src/config";

export class FeedbackService {
  static saveFeedback = (data: any, recaptcha: any) => {
    return axiosInstance.post(FEEDBACK_API + "/feedback/save-feedback", data, {
      headers: {
        recaptcha,
      },
    });
  };
  static getListFeedback = async (params?: any) => {
    return axiosInstance.get(FEEDBACK_API + "/feedback/get-list-feedback", {
      params,
    });
  };
  static changeStatusFeedback = (params?: any) => {
    return axiosInstance.get(FEEDBACK_API + "/feedback/change-status-feedback", {
      params,
    });
  };
}
