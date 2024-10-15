import { axiosInstance } from "@src/api/axiosInstance";
import { CMS_API } from "@src/config";
import { ActivityTypeEnum } from "@src/constants/cms/activity/activity.constant";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import _ from "lodash";

class CmsService {
  static getQuestionBankSkipError(
    questionBankId: any,
    includeAnswer: boolean = false,
    loadBankUsages: boolean = false
  ) {
    return axiosInstance.get(
      CMS_API +
        `/questionbank/bank/details?id=${questionBankId}&includeAnswers=${includeAnswer}&loadBankUsages=${loadBankUsages}&skipErrorPage=true`
    );
  }
  static getQuestionBank(
    questionBankId: any,
    includeAnswer: boolean = false,
    loadBankUsages: boolean = false,
    pageSize: number = 10,
    pageIndex: number = 1,
    questionContent: string = "",
    tag: string = "",
    questionType: string | number = -404
  ) {
    const params = new URLSearchParams({
      id: questionBankId,
      includeAnswers: includeAnswer.toString(),
      loadBankUsages: loadBankUsages.toString(),
      pageSize: pageSize.toString(),
      pageIndex: pageIndex.toString(),
      questionContent: questionContent.trim(),
      tag: tag.trim(),
      questionType: questionType.toString(),
    }).toString();
    return axiosInstance.get(CMS_API + `/questionbank/bank/details?${params}`);
  }
  static getAllQuestionBank(filter: any, excludedUniqueIds: any, excludeNoQuestions: boolean = false) {
    if (filter.visibility && filter.visibility != "private") {
      delete filter.courseId;
      delete filter.sectionId;
    }
    const params = new URLSearchParams({
      ...filter,
      excludeNoQuestions: excludeNoQuestions,
    }).toString();
    let excludedIdsString = "";
    if (excludedUniqueIds && excludedUniqueIds.length) {
      excludedIdsString = `&excludedIds=${excludedUniqueIds.join("&excludedIds=")}`;
    }
    return axiosInstance.get(CMS_API + `/questionbank/banks/?${params}${excludedIdsString}`);
  }
  static getVideoSubtitles(activityId: number, lang: string) {
    return CMS_API + `/activity/subtitle/${activityId}.${lang}.vtt`;
  }
  static addUser(data: any) {
    return axiosInstance.put(CMS_API + "/course/adduser", data);
  }
  static getSections(params: any) {
    return axiosInstance.get(CMS_API + `/section`, {
      params,
    });
  }
  static getSectionsByIds(data: any) {
    return axiosInstance.post(CMS_API + `/section/get-section-by-ids`, data);
  }
  static getSection(id: any) {
    return axiosInstance.get(CMS_API + `/section/details?id=${id}`);
  }
  static getSectionDetail(params: any) {
    return axiosInstance.get(CMS_API + `/section/details`, {
      params,
    });
  }
  static saveSection(data: any) {
    return axiosInstance.post(CMS_API + `/section`, data);
  }
  static getCategories(params: any) {
    return axiosInstance.get(CMS_API + `/category`, {
      params,
    });
  }
  static saveOrUpdateCategory(data: any) {
    if (data && data?.id) {
      return updateCategory(data);
    }
    return saveCategory(data);
  }
  static deleteCategory(id: number) {
    return axiosInstance.delete(CMS_API + "/category?id=" + id);
  }
  static setUserRole = (data: any) => {
    return axiosInstance.put(CMS_API + "/course/setuserroles", data);
  };
  static getQuestionByIds = (uniqueIds: any) => {
    return axiosInstance
      .post(CMS_API + `/learning/question-bank/get-questions-by-ids`, {
        questionUniqueIds: uniqueIds,
      })
      .then((response: any) => {
        return response.data;
      });
  };
  static saveOrUpdateQuestion = (data: any) => {
    const requestData = FunctionBase.parseIntValue(data, ["bankId", "level", "mark"]);
    if (requestData?.id) {
      return updateQuestion(requestData);
    }
    return saveQuestion(requestData);
  };
  static async deleteQuestion(questionId: any) {
    return axiosInstance.delete(CMS_API + `/questionbank/bank/question?id=${questionId}`);
  }

  static async searchQuestion(params: any) {
    return axiosInstance.get(CMS_API + `/learning/question-bank/search-questions`, {
      params: params,
    });
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
  static getActivity(id: any, includeSettings: boolean = false) {
    return axiosInstance.get(CMS_API + `/activity/details?id=${id}&includeSettings=${includeSettings}`);
  }
  static async deleteActivity(id: any) {
    return axiosInstance.delete(CMS_API + `/activity?id=${id}`);
  }
  static async getActivities(filter: any = {}, excludedIds: any, supportedTypes: any, selectableCourseId: any) {
    const params = new URLSearchParams(filter);
    if (filter.activityType) {
      params.set("type", params.get("activityType")!);
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
      CMS_API +
        `/activity/?${params.toString()}${excludedIdsString}${supportedTypesString}` +
        (selectableCourseId ? `&selectableCourseId=${selectableCourseId}` : "")
    );
  }

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

  static async getScratchDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.Scratch);
  }

  static async getScomDefaultSetting() {
    return getActivityDefaultSetting(ActivityTypeEnum.SCORM);
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
    const requestData = getRequestData(data, ActivityTypeEnum.SCORM);
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
  static getCourseUser = (courseId: any) => {
    return axiosInstance.get(CMS_API + `/course/getusers?courseId=${courseId}`);
  };
  static removeUser = (data: any) => {
    return axiosInstance.put(CMS_API + "/course/deleteuser", data);
  };
  static deleteSchedule = (data: any) => {
    return axiosInstance.post(CMS_API + "/course/delete-schedule", data);
  };
  static hasMajor = (data: any) => {
    return axiosInstance.post(CMS_API + "/course/course-has-major-activity", data);
  };
  static cloneActivity = (activityId: number, sectionId: number | null | undefined, pushToStore?: boolean) => {
    return axiosInstance.post(CMS_API + "/activity/clone", {
      activityId,
      sectionId,
      pushToStore,
    });
  };
  static getSectionsWithExcludeIds = (data: any) => {
    return axiosInstance.post(CMS_API + `/section/get-sections-with-excludeids`, data);
  };
  static getAllQuiz = (filter: any, excludedUniqueIds: any = [], excludeNoAnswers: boolean = false) => {
    const courseId = filter.courseId ? parseInt(filter.courseId) : 0;
    const sectionId = filter.sectionId ? parseInt(filter.sectionId) : 0;

    let newFilter = { ...filter };
    if (courseId) {
      newFilter = {
        ...newFilter,
        courseId: courseId,
      };
    }

    if (sectionId) {
      newFilter = {
        ...newFilter,
        sectionId: sectionId,
      };
    }

    if (filter.visibility && filter.visibility != "private") {
      delete newFilter.courseId;
      delete newFilter.sectionId;
    }

    newFilter = {
      ...newFilter,
      excludedUniqueIds: excludedUniqueIds,
    };
    // const params = new URLSearchParams({
    //     ...newFilter,
    //     excludeNoAnswers: excludeNoAnswers
    // }).toString();

    // let excludedIdsString = ''
    // if (excludedUniqueIds && excludedUniqueIds.length) {
    //     excludedIdsString = `&excludedUniqueIds=${excludedUniqueIds.join(
    //         '&excludedUniqueIds=',
    //     )}`
    // }

    // return axiosInstance.get(CMS_API + `/questionbank/bank/question/search?${params}${excludedIdsString}`).then((response: any) => {
    //     if (response.status !== 200) {
    //         Notify.error("Something wrong")
    //     }
    //     return response.data;
    // });

    return axiosInstance.post(CMS_API + `/questionbank/bank/question/search`, newFilter).then((response: any) => {
      return response.data;
    });
  };
  static syncCourseByListCourse = async (courseCodes: any) => {
    let promises: any = [];
    courseCodes.forEach((courseCode: any) => {
      promises.push(syncCourse(courseCode));
    });
    const responseData = await Promise.all(promises);
    const results = responseData.map((x: any) => {
      let status: boolean = false;
      let error: string = "";
      if (!x) {
        status = false;
      } else {
        if (x.status === 200) {
          status = true;
        }
        if (x.status === 204) {
          error = "NOT_FOUND";
        }
      }

      return {
        status: status,
        error: error,
      };
    });

    const isUpdate = results.find((x: any) => x.status);
    if (isUpdate) {
      PubSub.publish("COURSE_SYNC_UPDATED", results);
    }
    return results;
  };
  static updateScheduleByCourseId = (courseId: number, data: any) => {
    return axiosInstance.put(CMS_API + "/course/update-schedule/" + courseId, data);
  };
  static addOrUpdateCourse = (data: any, isNew?: boolean) => {
    if (isNew) return saveCourse(data);
    return updateCourse(data);
  };
  static addSection = (data: any) => {
    return axiosInstance.post(CMS_API + "/section", data);
  };
  static removeSection = (sectionId: any) => {
    return axiosInstance.delete(CMS_API + `/section?id=${sectionId}`);
  };
  static releaseCourse = (data: any) => {
    return axiosInstance.put(CMS_API + "/course/release", data);
  };
  static addOrUpdateCourseCombo = (data: any, isNew?: boolean) => {
    if (isNew) return saveCourseCombo(data);
    return updateCourseCombo(data);
  };
  static activitySearchActivity = (data: any) => {
    return axiosInstance.post(CMS_API + "/activity/search-activity", data);
  };
  static updateSection = (data: any) => {
    return axiosInstance.put(CMS_API + "/section", data);
  };
  static deleteCourse = (courseId: any) => {
    return axiosInstance.delete(CMS_API + "/course/?id=" + courseId);
  };
  static getProviders = (params: any) => {
    return axiosInstance.post(CMS_API + `/course/providers`, null, {
      params,
    });
  };
  static getCourses = (params: any) => {
    return axiosInstance.get(CMS_API + "/course", {
      params,
    });
  };
  static getCourseDetails = (params: any) => {
    return axiosInstance.get(CMS_API + `/course/details`, {
      params: params,
    });
  };
  static publishCourse = (data: any) => {
    return axiosInstance.put(CMS_API + "/course/publish", data);
  };
  static updateActivityAllowPreview = (data: any) => {
    return axiosInstance.post(CMS_API + "/section/update-activity-allow-preview", data);
  };
  static async codeGetSettings() {
    return await axiosInstance.get(CMS_API + `/codeactivity/settings`);
  }
  static async saveCodeActivity(data: any) {
    return await axiosInstance.post(CMS_API + "/codeactivity", data);
  }
  static async putCodeActivity(data: any) {
    return await axiosInstance.put(CMS_API + "/codeactivity", data);
  }
  static async getById(id: number) {
    return await axiosInstance.get(CMS_API + `/codeactivity/${id}`);
  }
  static uploadAntVideo = (data: any) => {
    return axiosInstance.post(`${process.env.NEXT_PUBLIC_API_UPLOAD}/upload/file/uploadvideoant`, data);
  };
  static createFolder = (data: any) => {
    return axiosInstance.post(CMS_API + `/antvideo/folder`, data);
  };
  static deleteFolder = (id: any) => {
    return axiosInstance.delete(CMS_API + "/antvideo/folder/delete/" + id);
  };
  static editFolder = (data: any) => {
    return axiosInstance.put(CMS_API + "/antvideo/update-file-or-folder", data);
  };
  static antVideoById = (id: number) => {
    return axiosInstance.get(CMS_API + `/antvideo/${id}`);
  };
  static antVideo = (params?: any) => {
    return axiosInstance.get(CMS_API + `/antvideo`, {
      params: {
        ...params,
        sortBy: "date",
        orderBy: "desc",
        pageSize: 12,
      },
    });
  };

  static checkCreateActivityPermission = () => {
    return axiosInstance.get(CMS_API + "/activity/check-create-activity-permission")
  }
  static checkCreateCoursePermission = () => {
    return axiosInstance.get(CMS_API + "/course/check-create-course-permission")
  }
}

export default CmsService;

const saveCourseCombo = (data: any) => {
  return axiosInstance.post(CMS_API + "/course/create-course-combo", data).then((response: any) => {
    return response;
  });
};

const updateCourseCombo = (data: any) => {
  return axiosInstance.put(CMS_API + "/course/update-course-combo", data).then((response: any) => {
    return response;
  });
};

const saveCourse = (data: any) => {
  return axiosInstance.post(CMS_API + "/course", data).then((response: any) => {
    return response;
  });
};

const updateCourse = (data: any) => {
  return axiosInstance.put(CMS_API + "/course", data).then((response: any) => {
    return response;
  });
};

const syncCourse = (courseCode: any) => {
  const requestParam = {
    courseCode: courseCode,
    clearnBeforeSync: true,
  };
  return axiosInstance.post(CMS_API + "/learning/courses/synccourses", requestParam);
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

const getResponseDefaultSetting = (data: any, activityType: any) => {
  const activity = ActivityHelper.getActivityByActivityType(activityType);
  if (!activity?.name) {
    return null;
  }

  return data[activity.name.toLowerCase()];
};

const updateActivityDefaultSetting = (data: any) => {
  return axiosInstance.post(CMS_API + "/activity/settings/union", data);
};

const updateActivityIncludeSettings = (data: any) => {
  return axiosInstance.put(CMS_API + "/activity/activity-include-settings", data).then((x) => {
    PubSub.publish("ACTIVITY_CHANGED", data);
    PubSub.publish("COURSE_UPDATE_SECTION_SESSION", data);
    return x;
  });
};

const saveQuestion = (data: any) => {
  return axiosInstance.post(CMS_API + "/questionbank/bank/question", data);
};

const updateQuestion = (data: any) => {
  return axiosInstance.put(CMS_API + "/questionbank/bank/question", data).then((x: any) => {
    updateAnswers(data);
    return x;
  });
};

const deleteListAnswer = (data: any) => {
  return axiosInstance.put(CMS_API + `/questionbank/bank/question/answers`, {
    ids: data,
  });
};

const saveListAnswer = (data: any) => {
  return axiosInstance.post(CMS_API + `/questionbank/bank/question/answers`, data);
};

const updateListAnswer = (data: any) => {
  return axiosInstance.put(CMS_API + `/questionbank/bank/question/answer/multiple`, data);
};

const updateAnswers = async (data: any) => {
  const questionId = data.id;
  const answers = data.answers;
  const oldAnswers = data.old_answers;
  const listDelete = data.deletedList;

  let listNew: any[] = [],
    listUpdate: any[] = [];

  let listAnswerIds: any[] = [];

  answers.forEach((el: any) => {
    const element = {
      ...el,
      questionId: questionId,
    };
    if (!element.id) {
      listNew.push(element);
    } else {
      listAnswerIds.push(element.id);
      const isExist = oldAnswers.find((x: any) => {
        if (
          x.id === element.id &&
          x.content === element.content &&
          x.feedBack === element.feedBack &&
          x.isCorrect === element.isCorrect &&
          x.prompt === element.prompt // todo
        ) {
          return true;
        }

        return false;
      });
      if (!isExist) {
        // todo
        listUpdate.push(element);
      }
    }
  });

  const isChanged = listDelete.length || listNew.length || listUpdate.length;
  if (listDelete.length) {
    await deleteListAnswer(listDelete);
  }

  if (listNew.length) {
    await saveListAnswer(listNew);
  }
  if (listUpdate.length) {
    await updateListAnswer(listUpdate);
  }

  if (isChanged) {
    PubSub.publish("QUESTIONLIST_CHANGED", data);
  }

  return true;
};

const saveCourseActivity = (data: any) => {
  return axiosInstance.post(CMS_API + "/section/create-activity", data);
};

const saveActivityIncludeSettings = (data: any) => {
  return axiosInstance.post(CMS_API + "/activity/activity-include-settings", data);
};

const saveCategory = (model: any) => {
  return axiosInstance.post(CMS_API + "/category", model).then((x: any) => {
    if (!x?.data) return;
    return x.data;
  });
};

const updateCategory = (model: { id: number; name: string }) => {
  return axiosInstance.put(CMS_API + "/category", model).then((x: any) => {
    if (!x?.data) return;
    return x.data;
  });
};
