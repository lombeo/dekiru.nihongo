import { axiosInstance } from "@src/api/axiosInstance";
import { RECRUITMENT_API } from "@src/config";

export class RecruitmentService {
  static masterDataListGender = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-gender", {
      params,
    });
  };
  static masterDataListBusinessArea = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-business-area", {
      params,
    });
  };
  static masterDataListExperience = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-experience", {
      params,
    });
  };
  static masterDataListForeignLanguage = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-foreign-language", {
      params,
    });
  };
  static masterDataListIndustry = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-industry", {
      params,
    });
  };
  static masterDataListJobLevel = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-job-level", {
      params,
    });
  };
  static masterDataListLiteracy = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-literacy", {
      params,
    });
  };
  static masterDataListWorkingType = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-working-type", {
      params,
    });
  };
  static masterDataListCompanySize = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/list-company-size", {
      params,
    });
  };
  static masterDataAll = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/masterdata/all", {
      params,
    });
  };
  static companyList = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/company/list", {
      params,
    });
  };
  static companyDetailById = async (id: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/company/detail-by-id/${id}`);
  };
  static companyDetail = async (permalink: any, params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/company/detail/${permalink}`, {
      params,
    });
  };
  static companySave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/company/save", data);
  };
  static companyDelete = async (id: any) => {
    return axiosInstance.delete(RECRUITMENT_API + `/company/delete/${id}`);
  };
  static jobSave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/job/save", data);
  };
  static jobList = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/job/list", {
      params,
    });
  };
  static jobSearch = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/job/search", {
      params,
    });
  };
  static jobRecommend = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/job/recommend", {
      params,
    });
  };
  static jobDelete = async (id: any) => {
    return axiosInstance.delete(RECRUITMENT_API + `/job/delete/${id}`);
  };
  static jobUpdateStatus = async (jobId: any, status: any) => {
    return axiosInstance.post(RECRUITMENT_API + `/job/update-status`, {
      jobId,
      status,
    });
  };
  static jobGetDetail = async (permalink: any, params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/job/detail/${permalink}`, {
      params,
    });
  };
  static jobGetDetailById = async (id: any, params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/job/detail-by-id/${id}`, {
      params,
    });
  };
  static applyJobApply = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + `/applyjob/apply`, data);
  };
  static applyJobDelete = async (id: any) => {
    return axiosInstance.delete(RECRUITMENT_API + `/applyjob/delete/${id}`);
  };
  static applyJobList = async (params: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/applyjob/list`, {
      params,
    });
  };
  static jobBookmark = async (jobId: any, isRemove) => {
    return axiosInstance.post(RECRUITMENT_API + `/job/bookmark`, {
      jobId,
      isRemove,
      progress: false,
    });
  };
  static candidateFollowCompany = async (companyId: any, isRemove) => {
    return axiosInstance.post(RECRUITMENT_API + `/candidate/follow-company`, {
      companyId,
      isRemove,
      progress: false,
    });
  };
  static candidateSearch = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/candidate/search", {
      params,
    });
  };
  static candidateExport = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/candidate/export", {
      params,
    });
  };
  static candidateDetail = async (userId: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/candidate/detail/${userId}`);
  };
  static cvList = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/cv/list", {
      params,
    });
  };
  static cvSave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/cv/save", data);
  };
  static cvGetDetailById = async (id: any, params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + `/cv/detail/${id}`, {
      params,
    });
  };
  static cvDelete = async (id: any) => {
    return axiosInstance.delete(RECRUITMENT_API + `/cv/delete/${id}`);
  };
  static recruitmentManagerList = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/recruitmentmanager/list", {
      params,
    });
  };
  static recruitmentManagerSave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/recruitmentmanager/save", data);
  };
  static recruitmentManagerDelete = async (id: any) => {
    return axiosInstance.delete(RECRUITMENT_API + `/recruitmentmanager/delete/${id}`);
  };
  static cvSwitchIsOpenStatus = async (id: any) => {
    return axiosInstance.post(RECRUITMENT_API + `/cv/switch-open-status`, null, {
      params: {
        id: id,
      },
    });
  };
  static cvSwitchIsPublicStatus = async (id: any) => {
    return axiosInstance.post(RECRUITMENT_API + `/cv/switch-public-status`, null, {
      params: {
        id: id,
      },
    });
  };
  static groupList = async (params?: any) => {
    return axiosInstance.get(RECRUITMENT_API + "/group/list", {
      params,
    });
  };
  static groupSave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/group/save", data);
  };
  static groupDelete = async (id: any) => {
    return axiosInstance.delete(RECRUITMENT_API + `/group/delete/${id}`);
  };
  static candidateGroupSave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/candidategroup/save", data);
  };
  static candidateSave = async (data: any) => {
    return axiosInstance.post(RECRUITMENT_API + "/candidate/save", data);
  };
  static recruitmentManagerIsManager = async () => {
    return axiosInstance.get(RECRUITMENT_API + "/recruitmentmanager/is-recruitment-manager");
  };
}
