import { Text } from "@mantine/core";
import { getCookie } from "@src/helpers/cookies.helper";

export enum EvaluateGradeEnum {
  None = 0,
  HighDistinction = 1,
  Distinction = 2,
  Credit = 3,
  Pass = 4,
  Weak = 5,
  Poor = 6,
}

export enum EvaluateStatusEnum {
  None = 0,
  Waiting = 1,
  Running = 2,
  Finished = 3,
  Expired = 4,
}

export enum ProgressActivityStatus {
  NotStart = 0,
  InProgress = 1,
  Finished = 2,
}

export enum DifficultEnum {
  All = 0,
  Easy = 1,
  Medium = 2,
  Hard = 3,
}
export const cookieEvaluate = getCookie("Cookie_Evaluating");
export const padToTwoDigits = (num) => (num < 10 ? `0${num}` : num.toString());
