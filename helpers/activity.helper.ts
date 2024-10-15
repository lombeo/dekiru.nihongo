import { activityTypes } from "@src/constants/activity/activity.constant";
import { ActivityCodeTypeEnum } from "@src/constants/cms/activity-code/activity-code.constant";
import { handleMultipleLangActivity } from "@src/modules/cms/activities/form/ActivityForm";
import { v4 as uuidv4 } from "uuid";

export const ActivityHelper = {
  getActivityByActivityType: (activityType: any) => {
    return activityTypes.find((x: any) => x.type === activityType);
  },
  getActivityName: (activityTypeId?: any): any => {
    if (!activityTypeId) return "null";
    const res = activityTypes.find((x) => (x.type as number) === activityTypeId);

    if (!res) {
      return "undefinded activity";
    }
    return res.label;
  },
  getSettings: (data: any) => {
    if (!data) return null;
    if (!data.activitySettings) return null;
    if (data.activitySettings.length <= 0) return null;
    let response = JSON.parse(data?.activitySettings[0]?.json);
    if (response && response?.url?.includes(".html")) {
      let link = new URL(response?.url);
      let url = link.origin + "/streams/" + link.searchParams.get("id");
      response.url = url;
    }
    return ActivityHelper.convertEnabledFieldSetting(response);
  },
  getActivityCodeSubTypeName: (activityCodeSubType?: any): any => {
    if (activityCodeSubType === ActivityCodeTypeEnum.Code) return "Programming";
    if (activityCodeSubType === ActivityCodeTypeEnum.OOP) return "OOP";
    if (activityCodeSubType === ActivityCodeTypeEnum.SQL) return "SQL";
    if (activityCodeSubType === ActivityCodeTypeEnum.Scratch) return "Scratch";
    return null;
  },
  convertEnabledFieldSetting: (data: any) => {
    return {
      ...data,
      enabledFields: ActivityHelper.convertToInitialEnabledFields(data?.enabledFields),
    };
  },
  convertToInitialEnabledFields: (data: any) => {
    let response: any = {};
    if (!data) return {};
    data.map((x: any) => {
      response[x] = true;
    });
    return response;
  },
  convertEnabledFieldsParams: (data: any) => {
    const enableFieldBooleanArray = data.enabledFields;
    let enableFieldStringArray = [];
    for (const key in enableFieldBooleanArray) {
      if (enableFieldBooleanArray[key]) {
        enableFieldStringArray.push(key);
      }
    }
    return {
      ...data,
      enabledFields: enableFieldStringArray,
    };
  },
  convertFeedbackStatements: (data: any) => {
    if (!data) return [];
    return data.map((x: any) => {
      return {
        uuid: uuidv4(),
        content: x,
      };
    });
  },
  getActivityIncludeSettingsData: (activityData: any, settingsData: any, activityType: any) => {
    const activity = ActivityHelper.getActivityByActivityType(activityType);
    if (!activity?.name) {
      return null;
    }
    const requestData = ActivityHelper.convertEnabledFieldsParams(settingsData);
    activityData.activityUsers = activityData.activityUsers
      ?.filter((e: any) => !e.isDeleted || e._id)
      ?.map((e: any) => ({
        userId: e.userId,
        roles: [1],
        isDeleted: e.isDeleted || false,
        activityId: activityData.id,
        id: e._id || 0,
      }));
    return {
      activity: handleMultipleLangActivity(activityData),
      settings: {
        [activity.name.toLowerCase()]: requestData,
      },
    };
  },
};
