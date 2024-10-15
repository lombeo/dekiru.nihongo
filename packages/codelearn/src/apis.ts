import { LEARN_API } from "@src/config";
import { ApiHelper } from "@src/helpers/api.helper";

export enum CodelearnAPIEnums {
  GET_LEADERBOARD = "/learn/coding/getleaderboard",
  GET_SUMISSION = "/learn/coding/getsubmmitedhistory",
  GET_SOLUTIONS = "/learn/coding/getbestsolution",
  UPDATE_BEST_SOLUTION = "/learn/coding/updatebestsolution",
  USER_SUBMIT_CODE = "/learn/coding/usersubmitcode",
  GET_RUNCODE_LOG = "/learn/coding/runtest",
}

export const CodelearnAPIs = ApiHelper.getListUri(LEARN_API, CodelearnAPIEnums);
