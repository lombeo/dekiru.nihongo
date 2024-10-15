import { axiosInstance } from "@src/api/axiosInstance";
import { CODING_API } from "@src/config";

class CodingService {
  static contestGetSubmitHistoryDetail = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/get-submit-history-detail", data);
  };
  static contestRegisterRegister = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/register", data);
  };
  static contestRegisterInertRegister = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/insert-register", data);
  };
  static contestRegisterChangeDescription = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/change-description", data);
  };
  static contestRegisterCancelRegisted = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/cancel-registed", data);
  };
  static activitySearchActivity = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/activity/search-activity", data);
  };
  static contestSave = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/save", data);
  };
  static contestDelete = async (id: number) => {
    return axiosInstance.delete(CODING_API + `/coding/contest/delete/${id}`);
  };
  static contestDetail = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/details", {
      params,
    });
  };
  static contestList = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/list", data);
  };
  static contestGetLeaderBoard = (params: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/get-leader-board?progress=false", null, {
      params,
    });
  };
  static contestSubmitRuntest = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/runtest", {
      params,
    });
  };
  static contestGetCodeActivity = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-code-activity", {
      params,
    });
  };
  static contestGetQuizActivity = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-quiz-activity", {
      params,
    });
  };
  static contestSubmitQuiz = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/submit-quiz", data);
  };
  static contestRun = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/run", data);
  };
  static submitAssignment = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/submit-assignment", data);
  };
  static updateAssignmentPoint = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/update-assignment-point", data);
  };
  static contestGetActivityLeaderBoard = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-activity-leader-board", {
      params,
    });
  };
  static contestGetActivityHistory = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-activity-history", {
      params,
    });
  };
  static contestGetActivityBestSolution = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-activity-best-solution", {
      params,
    });
  };
  static contestUpdateActivityBestSolution = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/update-activity-best-solution", data);
  };
  static team = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/team", {
      params,
    });
  };
  static teamAddMember = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/team/add-member", data);
  };
  static teamRemoveMember = (data: any) => {
    return axiosInstance.put(CODING_API + "/coding/team/remove-member", data);
  };
  static teamResponseTeamRequest = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/team/response-team-request", data);
  };
  static teamCreateTeam = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/team/create-team", data);
  };
  static teamUpdateTeam = (data: any) => {
    return axiosInstance.put(CODING_API + "/coding/team/update-team", data);
  };
  static teamDeleteTeam = async (teamId: any) => {
    return axiosInstance.delete(CODING_API + `/coding/team/delete-team/${teamId}`);
  };
  static contestRegisterKickoutRegisted = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/kickout-registed", data);
  };
  static contestRegisterApproveRegisted = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/approve-registed", data);
  };
  static contestRegisterCheckUserLevel = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/check-user-level", data);
  };

  static contestRegisterImportRegister = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest-register/import-registers", data);
  };
  static contestRegisterExportRegisters = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/export-registers", {
      params,
    });
  };
  static contestSynchronizeTask = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/sync-activity", data);
  };
  static leaderboardList = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/leaderboard/get-top-ranks", {
      params,
    });
  };
  static getFinishContests = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-finished-contests", {
      params,
    });
  };
  static getFinishActivitiesContest = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-finished-activities-in-contest", {
      params,
    });
  };
  static getUserCompletedChallenge = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/get-user-completed-challenge", {
      params,
    });
  };
  static getUserCompletedTraining = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/get-user-completed-task", {
      params,
    });
  };
  static trainingRefreshCacheUserCompletedTask = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/refresh-cache-user-completed-task", {
      params,
    });
  };
  static challengeRefreshCacheUserCompletedChallenge = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/refresh-cache-user-completed-challenge", {
      params,
    });
  };
  static trainingList = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/list", {
      params,
    });
  };
  static trainingGetCodeActivity = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/get-code-activity", {
      params,
    });
  };
  static trainingRun = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/training/run", data);
  };
  static trainingGetActivityLeaderBoard = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/get-activity-leader-board", {
      params,
    });
  };
  static trainingGetActivityHistory = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/get-activity-history", {
      params,
    });
  };
  static trainingGetActivityBestSolution = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/get-activity-best-solution", {
      params,
    });
  };
  static trainingUpdateActivityBestSolution = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/training/update-activity-best-solution", data);
  };
  static activityHiddenActivity = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/activity/hidden-activity", data);
  };
  static challengeList = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/list", {
      params,
    });
  };
  static challengeSave = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/challenge/save", data);
  };
  static challengeGetCodeActivity = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/get-code-activity", {
      params,
    });
  };
  static challengeRun = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/challenge/run", data);
  };
  static challengeGetActivityLeaderBoard = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/get-activity-leader-board", {
      params,
    });
  };
  static challengeGetActivityHistory = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/get-activity-history", {
      params,
    });
  };
  static challengeGetActivityBestSolution = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/get-activity-best-solution", {
      params,
    });
  };
  static challengeUpdateActivityBestSolution = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/challenge/update-activity-best-solution", data);
  };
  static challengeDetailChallenge = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/challenge/detail-challenge", {
      params,
    });
  };
  static challengeDelete = (id: any) => {
    return axiosInstance.delete(CODING_API + `/coding/challenge/${id}`);
  };
  static challengeynchronizeTask = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/challenge/sync-activity", data);
  };
  static userViewUserProfile = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/user/view-user-profile", { params });
  };
  static contestGetProfileContestList = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/get-profile-contest-list", data);
  };
  static trainingUserProfileTraining = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/user-profile-training", { params });
  };
  static getUserActivityStatistics = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/user/get-user-activity-statitics", { params });
  };
  static userGetUserSkillStatitics = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/user/get-user-skill-statitics", { params });
  };
  static contestGetContestForHome = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-contest-for-home", { params });
  };
  static trainingGetTrainingBlock = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/training/get-training-block", { params });
  };
  static userGetAllCountry = () => {
    return axiosInstance.get(CODING_API + "/coding/user/get-all-country");
  };
  static getListVoucher(params: any) {
    return axiosInstance.get(CODING_API + "/coding/contest/get-list-vouchers", {
      params: params,
    });
  }

  static deleteVoucher(data: any) {
    return axiosInstance.post(CODING_API + "/coding/contest/delete-list-vouchers", data);
  }
  static generateVoucher(data: any) {
    return axiosInstance.post(CODING_API + "/coding/contest/generate-vouchers", data);
  }
  static getOrderDetail(id: any) {
    return axiosInstance.get(CODING_API + `/coding/contest/order/${id}`);
  }
  static getEvaluateSetting = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate-setting/search", {
      params,
    });
  };
  static checkCreateEvaluate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate-setting/check-create-evaluating");
  };
  static deleteSettingEvaluate = (id: any) => {
    return axiosInstance.delete(CODING_API + `/coding/evaluate-setting/delete/${id}`);
  };
  static createEvaluateSetting = (value) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate-setting/create", value);
  };
  static updateEvaluateSetting = (value) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate-setting/update", value);
  };
  static updateSettingSystem = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate-setting/update-setting-system", value);
  };
  static getWarehouse = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/warehouse/search", {
      params,
    });
  };
  static saveWarehouse = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/warehouse/save", value);
  };
  static deleteWarehouse = (id: any) => {
    return axiosInstance.delete(CODING_API + `/coding/warehouse/${id}`);
  };
  static detailWarehouse = (params: any) => {
    return axiosInstance.get(CODING_API + `/coding/warehouse/detail`, { params });
  };
  static removeActivity = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/warehouse/remove-activity", value);
  };
  static synchronizeActivity = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/warehouse/synchronize-activity", value);
  };
  static synchronizeAllActivity = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/warehouse/synchronize-all-activity", value);
  };
  static addAcitvity = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/warehouse/add-activity", value);
  };
  static getActivityCode = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/warehouse/get-code-activity", { params });
  };
  static getActivityQuiz = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/warehouse/get-quiz-activity", { params });
  };
  static searchEvaluateTemplate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/search-template", { params });
  };
  static deleteTemplateEvaluating = (id: any) => {
    return axiosInstance.delete(CODING_API + `/coding/evaluate/delete-template/${id}`);
  };
  static saveTemplateEvaluating = (value: any) => {
    return axiosInstance.post(CODING_API + `/coding/evaluate/save-template/`, value);
  };
  static getDetailTemplate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/detail-template", { params });
  };
  static searchEvaluate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/search-evaluate", { params });
  };

  static saveEvaluate = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate/save-evaluate", value);
  };
  static detailEvaluate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/detail-evaluate", {
      params,
    });
  };
  static startEvaluate = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate/start-evaluate", value);
  };
  static submitEvaluate = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate/submit-evaluate", value);
  };
  static getQuizActivityEvaluate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/get-quiz-activity", { params });
  };
  static getCodeActivityEvaluate = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/get-code-activity", { params });
  };
  static getActivityHistory = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/evaluate/get-activity-history", { params });
  };
  static evaluateSubmitQuiz = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate/submit-quiz", value);
  };
  static evaluateSubmitCode = (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/evaluate/submit-code", value);
  };
  static userLevelSettingGetSettings = (params?: any) => {
    return axiosInstance.get(CODING_API + "/coding/userlevelsetting/get-settings", {
      params,
    });
  };
  static userLevelSettingUpdateSettings = (data: any) => {
    return axiosInstance.post(CODING_API + "/coding/userlevelsetting/update-settings", data);
  };
  static getCodingReportByOwnerIds = async (value: any) => {
    return axiosInstance.post(CODING_API + `/coding/report/get-coding-report-by-owner-ids`, value);
  };
  static getContestByOwnerIds = async (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/contest/get-contest-by-owner-ids", value);
  };
  static getTrainingByOwnerIds = async (value: any) => {
    return axiosInstance.post(CODING_API + "/coding/training/get-training-by-owner-ids", value);
  };
  static release(data: any) {
    return axiosInstance.post(CODING_API + "/coding/activity/publish-activity", data);
  }
  static getSubbatchActivities = (params?: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-subbatch-activities", {
      params,
    });
  };
  static startEventActivity(data: any) {
    return axiosInstance.post(CODING_API + "/coding/contest/start-test", data);
  }
  static getEventQuizQuestion = (params?: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-quiz-question", {
      params,
    });
  };
  static submitEventQuizAnswer(data: any) {
    return axiosInstance.post(CODING_API + "/coding/contest/submit-question", data);
  }
  static getEventLeaderboard = (params?: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/get-quiz-subbatch-leaderboard", {
      params,
    });
  };
  static exportContestLeaderboard = (params: any) => {
    return axiosInstance.get(CODING_API + "/coding/contest/export-contest-quiz-leaderboard", {
      params,
    });
  };
  static getEventData = () => {
    return axiosInstance.get(CODING_API + `/coding/contest/get-event-contest/1`);
  };
  static getEventDataForEdit = () => {
    return axiosInstance.get(CODING_API + `/coding/contest/get-for-edit-event-contest/1`);
  };
  static saveEventData(data: any) {
    return axiosInstance.post(CODING_API + "/coding/contest/save-event-contest", data);
  }
  static getAllCountry = (params) => {
    return axiosInstance.get(CODING_API + "/coding/user/get-all-country", {
      params,
    });
  };
  static handleGetGiftLuckySpin = (params) => {
    return axiosInstance.get(CODING_API + "/coding/event-contest/spin-gift", {
      params,
    });
  };
  static handleGetGiftLuckySpinHistory = (params) => {
    return axiosInstance.get(CODING_API + "/coding/event-contest/get-spin-gift-history", {
      params,
    });
  };
  static eventContestRegister(data: any) {
    return axiosInstance.post(CODING_API + "/coding/contest-register/register", data);
  }
  static triggerContestQuizLeaderBoard(params) {
    return axiosInstance.get(CODING_API + "/coding/contest/trigger-contest-quiz-leaderboard", { params });
  }
  static getEventReport(params) {
    return axiosInstance.post(CODING_API + "/coding/event-contest/get-event-report",  params );
  }
}

export default CodingService;
