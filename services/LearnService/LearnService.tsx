import { axiosInstance } from "@src/api/axiosInstance";
import { LEARN_API } from "@src/config";
import axios from "axios";

export class LearnService {
  static userRoles() {
    return axiosInstance.get(LEARN_API + `/learn/user/user-roles`);
  }
  static userGetAllBadges = () => {
    return axiosInstance.get(LEARN_API + "/learn/user/get-all-badges?progress=false");
  };
  static getLearnReportOwnerIds = async (data: any) => {
    return axiosInstance.post(LEARN_API + `/learn/report/get-learn-report-by-owner-ids`, data);
  };
  static getCourseByOwnerIds = async (data: any) => {
    return axiosInstance.post(LEARN_API + `/learn/course/get-course-by-owner-ids`, data);
  };
  static getClassByOwnerIds = async (data: any) => {
    return axiosInstance.post(LEARN_API + `/learn/class/get-class-by-owner-ids`, data);
  };
  static courseBuyVoucher = async (data: any) => {
    return axiosInstance.post(LEARN_API + `/learn/course/buy-voucher`, data);
  };
  static getCourseList = async () => {
    try {
      const response = await axios.get("https://lombeo-api-authorize.azurewebsites.net/authen/course/get-all-course");
      return response.data;
    } catch (error) {
      console.error("Error fetching courses data:", error);
      throw error;
    }
  }
  static getLearningBanner = () => {
    return axiosInstance.get("/learn/systemsetting/get-learning-banner");
  };
  static setLearningBanner = (data: any) => {
    return axiosInstance.post("/learn/systemsetting/set-learning-banner", data);
  };
  static getPaidCourseList = (params?: any) => {
    return axiosInstance.get("/learn/course/get-paid-course-list", {
      params,
    });
  };
}
