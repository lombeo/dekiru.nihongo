import { axiosInstance } from "@src/api/axiosInstance";

export class LearnReportService {
  static exportOrgUserEnroll(data: any) {
    return axiosInstance.get<any>(`/learn/report/organization-course/export-enroll`, {
      params: data,
    });
  }
}
