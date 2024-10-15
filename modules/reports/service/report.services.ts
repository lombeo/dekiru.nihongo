import { axiosInstance } from "api/axiosInstance";
import { GetClassAssignmentFilter, PersonalCourseReportFilter } from "@src/modules/reports/service/type";

export class ReportService {
  static getPersonalCourseReport = (filter?: PersonalCourseReportFilter) => {
    return axiosInstance.get("/learn/report/course-progress", {
      params: filter,
    });
  };

  static postPersonalCourseExport = (filter?: any) => {
    return axiosInstance.post("/learn/report/export-personal-courses", filter);
  };

  static getCourseEnrolmentsReport = (filter?: any) => {
    return axiosInstance.get("/learn/report/course-enrolments", {
      params: filter,
    });
  };

  static getCodeActivitiesReport = (filter?: any) => {
    return axiosInstance.get("/learn/report/activity-code/get-submitted-history", {
      params: filter,
    });
  };

  static exportCodeActivitiesReport = (filter?: any) => {
    return axiosInstance.post("/learn/report/activity-code/export-submitted-history", filter);
  };

  //Get all organization courses
  static getClassAssignment = (filter?: GetClassAssignmentFilter) => {
    return axiosInstance.post("/learn/classes/assignment-process-report", filter);
  };
}
