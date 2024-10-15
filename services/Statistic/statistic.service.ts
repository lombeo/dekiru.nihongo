import { axiosInstance } from "api/axiosInstance";

export class StatisticServices {
  static exportData(data: any) {
    return axiosInstance.post("/statistics/v1/export/export-data", data);
  }

  static exportAssignment(params: any) {
    return axiosInstance.get("/statistics/v1/course-organization/assignment", {
      params,
    });
  }
}
