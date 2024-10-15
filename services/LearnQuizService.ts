import { axiosInstance } from "@src/api/axiosInstance";

export class LearnQuizService {
  static getExams(params: any) {
    return axiosInstance.get("/learn/quiz/get-exams", { params });
  }
}
