import { LEARN_API } from "@src/config";
import { ApiHelper } from "@src/helpers/api.helper";

export enum QuizAPIEnums {
  GET_TEST_DETAIL = "/learn/quiz/get-test",
  OPEN_QUIZ_NOW = "/learn/quiz/open-now",
  START_TEST = "/learn/quiz/start-test",
  FINISH_TEST = "/learn/quiz/finish-test",
  EXPORT_TEST = "/learn/quiz/export-tests",
  GET_ALL_USER_LOCKED = "/learn/quiz/get-all-user-locked",
}

export const QuizAPIs = ApiHelper.getListUri(LEARN_API, QuizAPIEnums);
