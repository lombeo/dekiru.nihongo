import { axiosInstance } from "api/axiosInstance";
import { QuizAPIs } from "../apis";

export class QuizService {
  //Open quiz now
  static openQuizNow = (data: any) => {
    return axiosInstance.post(`${QuizAPIs.OPEN_QUIZ_NOW}`, data);
  };

  //Start test
  static startQuizNow = (data: any) => {
    return axiosInstance.post(`${QuizAPIs.START_TEST}`, data);
  };

  //Get test
  static getTestDetail = async (filter: any) => {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.get(`${QuizAPIs.GET_TEST_DETAIL}?${params}`);
  };

  static submitTestMulti = (data: any) => {
    return axiosInstance.post("/learn/quiz/execute-test-multi", data);
  };

  //Get user test
  static getUserTest = async (filter: any) => {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.get(`/learn/quiz/get-user-tests?${params}`);
  };

  //Export test
  static exportTest = (data: any) => {
    return axiosInstance.post(`${QuizAPIs.EXPORT_TEST}`, data);
  };

  //Get all tests
  static getAllTest = async (filter: any) => {
    return axiosInstance.get("/learn/quiz/get-all-tests", {
      params: filter,
    });
  };

  //Get all tests
  static getAllUserLocked = async (filter: any) => {
    return axiosInstance.get(QuizAPIs.GET_ALL_USER_LOCKED, {
      params: filter,
    });
  };
}
