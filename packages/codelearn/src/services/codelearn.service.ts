import { axiosInstance } from "api/axiosInstance";
import { CodelearnAPIs } from "../apis";

export class CodelearnService {
  static getLeaderboard = async (filter: any) => {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.get(`${CodelearnAPIs.GET_LEADERBOARD}`, filter);
  };

  static getSubmissions = async (filter: any) => {
    return axiosInstance.get(`${CodelearnAPIs.GET_SUMISSION}`, filter);
  };

  static getSolutions = async (filter: any) => {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.get(`${CodelearnAPIs.GET_SOLUTIONS}`, filter);
  };

  static getUserActivities = (params: any) => {
    return axiosInstance.get("/learn/coding/getusercodeactivity", {
      params,
    });
  };

  static updateBestSolution = (data: any) => {
    return axiosInstance.post(CodelearnAPIs.UPDATE_BEST_SOLUTION, data);
  };

  static submitSolution = (data: any) => {
    return axiosInstance.post("/learn/coding/usersubmitcode", data);
  };

  //Get run code logs
  static getRunCodeLogs = (params: any) => {
    return axiosInstance.get("/learn/coding/runtest", {
      params,
    });
  };
}
