import { CMS_API } from "@src/config";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { axiosInstance } from "api/axiosInstance";
import { ActivityTypeEnum } from "constants/common.constant";
import _ from "lodash";
import PubSub from "pubsub-js";

export class ActivityService {
  static getActivityIncludeSettingsData: any;
  static async getActivities(filter: any = {}, excludedIds: any, supportedTypes: any, selectableCourseId: any) {
    const params = new URLSearchParams(filter);
    if (filter.activityType) {
      params.set("type", params.get(CMS_API + "activityType")!);
      params.delete(CMS_API + "activityType");
    }
    let excludedIdsString = "";
    let supportedTypesString = "";
    let _excludedIds = excludedIds?.filter((e: any) => !_.isNil(e));
    if (_excludedIds.length) {
      excludedIdsString = `&excludedRefIds=${_excludedIds.join("&excludedRefIds=")}`;
    }
    if (supportedTypes && supportedTypes.length) {
      supportedTypesString = `&supportedTypes=${supportedTypes.join("&supportedTypes=")}`;
    }
    return axiosInstance.get(
      `/activity/?${params.toString()}${excludedIdsString}${supportedTypesString}` +
        (selectableCourseId ? `&selectableCourseId=${selectableCourseId}` : "")
    );
  }

  static async saveOrUpdateActivityIncludeSettings(data: any, isCourseActivity: any = false) {
    if (data && data?.id) {
      return updateActivityIncludeSettings(data);
    }
    if (isCourseActivity) {
      return saveCourseActivity(data);
    }
    return saveActivityIncludeSettings(data);
  }

  static async saveOrUpdateActivity(data: any, isCourseActivity: any = false) {
    if (data && data?.id) {
      return updateActivity(data);
    }
    if (isCourseActivity) {
      return saveCourseActivity(data);
    }
    return saveActivityIncludeSettings(data);
  }

  static async deleteActivity(id: any) {
    return axiosInstance.delete(CMS_API + `/activity?id=${id}`);
  }

  static getActivity(id: any, includeSettings: boolean = false) {
    return axiosInstance.get(`/activity/details?id=${id}&includeSettings=${includeSettings}`);
  }

  static getVideoSubtitles(activityId: number, lang: string) {
    return axiosInstance.defaults.baseURL + `/activity/subtitle/${activityId}.${lang}.vtt`;
  }

  // Get default settting for activites
  static async getReadingDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Reading);
  }

  static async getCQDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.CQ);
  }

  static async getFeedbackDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Feedback);
  }

  static async getAssignmentDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Assignment);
  }

  static async getScomDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Scorm);
  }

  static async getGroupDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Group);
  }

  static async getAttachmentDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.File);
  }

  static async getQuizDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Quiz);
  }

  // Update default settting for activites
  static async updateCQDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.CQ);
    return updateActivityDefaultSetting(requestData);
  }

  static async updateGroupDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Group);
    return updateActivityDefaultSetting(requestData);
  }

  static async updateAssignmentDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Assignment);
    return updateActivityDefaultSetting(requestData);
  }

  static async updateAttachmentDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.File);
    return updateActivityDefaultSetting(requestData);
  }

  static async updateFeedbackDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Feedback);
    return updateActivityDefaultSetting(requestData);
  }

  static async updateQuizDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Quiz);
    return updateActivityDefaultSetting(requestData);
  }

  static async updatePollDefaultSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Poll);
    return updateActivityDefaultSetting(requestData);
  }

  // Update activity  setting
  static async updateReadingSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Reading);
    return updateActivitySetting(requestData);
  }

  static async updateVideoSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Video);
    return updateActivitySetting(requestData);
  }

  static async updateFeedbackSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Feedback);
    return updateActivitySetting(requestData);
  }

  static async updateCQSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.CQ);
    return updateActivitySetting(requestData);
  }

  static async updateAssignmentSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Assignment);
    return updateActivitySetting(requestData);
  }

  static async updateScormSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Scorm);
    return updateActivitySetting(requestData);
  }

  static async updateAttachmentSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.File);
    return updateActivitySetting(requestData);
  }

  static async updateGroupSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Group);
    return updateActivitySetting(requestData);
  }

  static async updateQuizSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Quiz);
    return updateActivitySetting(requestData);
  }

  static async updatePollSetting(data: any) {
    const requestData = getRequestData(data, ActivityTypeEnum.Poll);
    return updateActivitySetting(requestData);
  }

  static cloneActivity(activityId: number, sectionId: number | null | undefined, pushToStore?: boolean) {
    return axiosInstance.post<boolean>("/activity/clone", {
      activityId,
      sectionId,
      pushToStore,
    });
  }
}

// Activity Base Function
const getResponseDefaultSetting = (data: any, activityType: any) => {
  const activity = ActivityHelper.getActivityByActivityType(activityType);
  if (!activity?.name) {
    return null;
  }

  return data[activity.name.toLowerCase()];
};

const getRequestData = (data: any, activityType: any) => {
  const activity = ActivityHelper.getActivityByActivityType(activityType);
  if (!activity?.name) {
    return null;
  }

  const requestData = ActivityHelper.convertEnabledFieldsParams(data);

  return {
    [activity.name.toLowerCase()]: requestData,
  };
};

const updateActivitySetting = (data: any) => {
  return axiosInstance
    .put(CMS_API + "/activity/settings", data)
    .then((x) => {
      if (!x) {
        PubSub.publish("UPDATE_ACTIVITY_SETTINGS_FAILED", data);
      }
      return x;
    })
    .catch(() => {
      PubSub.publish("UPDATE_ACTIVITY_SETTINGS_COMPLETED", data);
    });
};

const getActivityDefaultSetting = async (activityType: any) => {
  const response = await axiosInstance.get(CMS_API + `/activity/settings/union`);
  if (!response?.data) {
    return null;
  }
  return getResponseDefaultSetting(response.data, activityType);
};

const updateActivityDefaultSetting = (data: any) => {
  return axiosInstance.post(CMS_API + "/activity/settings/union", data);
};

const saveCourseActivity = (data: any) => {
  return axiosInstance.post(CMS_API + "/section/create-activity", data);
};

const saveActivity = (data: any) => {
  return axiosInstance.post(CMS_API + "/activity", data);
};

const saveActivityIncludeSettings = (data: any) => {
  return axiosInstance.post(CMS_API + "/activity/activity-include-settings", data);
};

const updateActivity = (data: any) => {
  return axiosInstance.put(CMS_API + "/activity", data).then((x) => {
    PubSub.publish("ACTIVITY_CHANGED", data);
    PubSub.publish("COURSE_UPDATE_SECTION_SESSION", data);
    return x;
  });
};

const updateActivityIncludeSettings = (data: any) => {
  return axiosInstance.put(CMS_API + "/activity/activity-include-settings", data).then((x) => {
    PubSub.publish("ACTIVITY_CHANGED", data);
    PubSub.publish("COURSE_UPDATE_SECTION_SESSION", data);
    return x;
  });
};
