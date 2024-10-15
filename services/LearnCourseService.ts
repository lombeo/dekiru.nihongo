import { axiosInstance } from "@src/api/axiosInstance";
import { COMMENT_API } from "@src/config";
import { AxiosResponse } from "axios";

export class LearnCourseService {
  static getCourseDetail(params: any) {
    return axiosInstance.get("/learn/course/get-personal-courses-detail", {
      params,
    });
  }
  static getOrgCourseDetail(filter: any) {
    return axiosInstance.get("/learn/course/get-organization-courses-detail", {
      params: filter,
    });
  }
  static getProviders(filter?: any) {
    return axiosInstance.get("/learn/course/providers", {
      params: filter,
    });
  }
  static updateProvider(data: any) {
    return axiosInstance.put("/learn/course/update-course-provider", data);
  }
  static enrollCourse(data: any) {
    return axiosInstance.post<any>("/learn/course/enroll", { ...data, groupId: 0 });
  }
  static unenrollCourse(data: any) {
    return axiosInstance.post<any>("/learn/course/unenroll", data);
  }
  static shareCertificate(enrolmentUniqueId: any) {
    return axiosInstance.get("/learn/course/share-certificate", {
      params: {
        enrolmentUniqueId: enrolmentUniqueId,
      },
    });
  }
  static addRemoveManager(data: any) {
    return axiosInstance.post(`/learn/course/add-remove-manager`, data);
  }
  static setPersonalCourseSubType(data: any) {
    return axiosInstance.post("/learn/course/update-subtype-course-personal", data);
  }
  static setPersonalCourseLimit(data: any) {
    return axiosInstance.post("/learn/course/update-limit-course-personal", data);
  }
  static rateCourse(data: any, recaptcha?: any): Promise<AxiosResponse<any>> {
    return axiosInstance.post(COMMENT_API + "/comment/rate/change-rate", data, {
      headers: {
        recaptcha,
      },
    });
  }
  static getCourseRatings(params: any): Promise<AxiosResponse<any>> {
    return axiosInstance.get(COMMENT_API + "/comment/rate/get-rate-summary-detail", { params });
  }
  static approveEnroll(data: any) {
    return axiosInstance.post("/learn/course/approve-enroll", data);
  }
  static getVideoSubtitles(activityId: any, lang: any) {
    return `/learn/course/subtitle/${activityId}.${lang}.vtt`;
  }
  static checkExistCourse(params: any) {
    return axiosInstance.get("/learn/course/check-exist-course", {
      params,
    });
  }
  static releaseCourse(data: any) {
    return axiosInstance.post("/learn/course/release-personnal-course", data);
  }
  static releaseCourseCombo(data: any) {
    return axiosInstance.post("/learn/course/release-course-combo", data);
  }
  static getCourses(params: any) {
    return axiosInstance.get("/learn/course/get-filter-course", {
      params,
    });
  }
  static getEnrolledCourses(params: any) {
    return axiosInstance.get("/learn/course/get-enrolled-courses", {
      params,
    });
  }
  static getPinnedCourses(filter: any) {
    return axiosInstance.post("/learn/course/get-personal-courses-of-courseids", filter);
  }
  static getRecommendCourses(filter: any) {
    const params = {
      ...filter,
      progress: false,
      isGetEnrolled: true,
    };
    return axiosInstance.get("/learn/course/get-personal-courses", {
      params,
    });
  }
  static getScheduleCourse(params: any) {
    return axiosInstance.get("/learn/course/get-course-schedules", {
      params,
    });
  }
  static markAsComplete(data: any) {
    return axiosInstance.post("/learn/course/mark-status-activity-in-course", data);
  }
  static postBulkActionEnrollment(data: any) {
    return axiosInstance.post("/learn/course/bulk-action-enrolment", data);
  }
  static getUnionActivity(activityId, permalink: string) {
    return axiosInstance.get("/learn/course/get-union-activity", {
      params: {
        permalink,
        activityId,
      },
      headers: {
        errorHandle: false,
      },
    });
  }
  static getListEnrollByCourseId(data: any) {
    return axiosInstance.post("/learn/course/get-user-enrolled", data);
  }
  static exportUserEnroll(data: any) {
    return axiosInstance.post<any>("/learn/course/export-user-enrolled", data);
  }
  static importUserEnroll(data: any) {
    return axiosInstance.post<any>("/learn/course/import-user-enrolled", data);
  }
  static getPersonalCourses(params: any) {
    return axiosInstance.get("/learn/course/get-personal-courses", {
      params,
    });
  }
  static addUserEnrolled(data: any) {
    return axiosInstance.post<any>("/learn/course/add-user-enrolled", data);
  }
  static updateUserEnrolled(data: any) {
    return axiosInstance.post<any>("/learn/course/update-user-enrolled", data);
  }
  static updateCourseLabel(data: any) {
    return axiosInstance.put<any>("/learn/course/label", data);
  }
  static getCoursesCompletedActivity(params: any) {
    return axiosInstance.get("/learn/course/get-courses-completed-activity", {
      params,
    });
  }
  static getCompletedActivity(params: any) {
    return axiosInstance.get("/learn/course/get-completed-activities", {
      params,
    });
  }
  static getCertificationOfUser(params?: any) {
    return axiosInstance.get("/learn/course/get-certification-of-user", {
      params,
    });
  }
  static getMyCourses(params?: any) {
    return axiosInstance.get("/learn/course/get-my-courses", {
      params,
    });
  }
  static getHomeCourses(params?: any) {
    return axiosInstance.get("/learn/course/get-home-courses", {
      params,
    });
  }
  static getCategories(params?: any) {
    return axiosInstance.get("/learn/course/get-categories", {
      params,
    });
  }
  static delete(id: any) {
    return axiosInstance.delete(`/learn/course/${id}`);
  }
  static getCourseProgressReport(params?: any) {
    return axiosInstance.get("/learn/course/get-course-progress-report", {
      params,
    });
  }
  static getCourseStatic(params?: any) {
    return axiosInstance.get(`/learn/course/get-courses-statistic`, {
      params,
    });
  }
  static addCart(data?: any) {
    return axiosInstance.post(`/learn/course/add-cart`, data);
  }
}
