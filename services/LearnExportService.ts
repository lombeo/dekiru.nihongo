import { axiosInstance } from "@src/api/axiosInstance";
import { QuizAPIs } from "@src/packages/quiz/src/apis";

export class LearnExportServices {
  static exportQuizFinal(params: any) {
    return axiosInstance.get("/learn/coursepersonalexport/course-quiz-final", {
      params,
    });
  }

  static exportLearningPlan(params: any) {
    return axiosInstance.get("/learn/coursepersonalexport/leaning-plan", {
      params,
    });
  }

  static exportQuiz(filter: any) {
    return axiosInstance.post(QuizAPIs.EXPORT_TEST, filter);
  }

  static exportActivityCode(filter: any) {
    return axiosInstance.get("/learn/coursepersonalexport/activity-user-coding", {
      params: filter,
      responseType: "blob",
    });
  }
  static exportAssignmentZip(data: any) {
    return axiosInstance.post("/learn/export-assignment-zip", data);
  }
  static exportScratchZip(data: any) {
    return axiosInstance.post("/learn/export-assignment-zip", data);
  }
}
