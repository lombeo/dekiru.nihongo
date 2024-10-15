import { axiosInstance } from "@src/api/axiosInstance";

export class LearnActivityService {
  static getListSubmissionAssignment = (params?: any) => {
    return axiosInstance.get("/learn/activity/get-list-submission-assignment-for-teacher", {
      params,
    });
  };
  static getSubmissionAssignment = (params?: any) => {
    return axiosInstance.get("/learn/activity/get-submission-assignment-detail", {
      params,
    });
  };
  static submitAssignment = async (data?: any) => {
    return axiosInstance.post("/learn/activity/submit-assignment", data);
  };
  static gradeAssignment = async (data?: any) => {
    return axiosInstance.post("/learn/update-assignment-point", data);
  };
  static commentAssignment = async (data?: any) => {
    return axiosInstance.post("/learn/update-assignment-comment", data);
  };
  static getListSubmissionScratch = (params?: any) => {
    return axiosInstance.get("/learn/activity/get-list-submission-assignment-for-teacher", {
      params,
    });
  };
  static getSubmissionScratch = (params?: any) => {
    return axiosInstance.get("/learn/activity/get-submission-assignment-detail", {
      params,
    });
  };
  static submitScratch = async (data?: any) => {
    return axiosInstance.post("/learn/activity/submit-assignment", data);
  };
  static gradeScratch = async (data?: any) => {
    return axiosInstance.post("/learn/update-assignment-point", data);
  };
}
