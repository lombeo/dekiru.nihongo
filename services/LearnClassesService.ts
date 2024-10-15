import { axiosInstance } from "@src/api/axiosInstance";

export class LearnClassesService {
  static startActivity = async (data?: any) => {
    return axiosInstance.post("/learn/classes/startclassactivity", data);
  };
  static classList = async (params: any) => {
    return axiosInstance.get("/learn/class/list", {
      params,
    });
  };
  static getClassDetail = async (params: any) => {
    return axiosInstance.get("/learn/class/detail", {
      params,
    });
  };
  static saveClass = async (value: any) => {
    return axiosInstance.post("/learn/class/save", value);
  };

  static deleteClass = async (value: any) => {
    return axiosInstance.delete(`/learn/class/${value}`);
  };
  static deleteMember = async (value: any) => {
    return axiosInstance.post(`/learn/class/delete-member`, value);
  };
  static checkRoleCreateClass = async () => {
    return axiosInstance.get("/learn/class/check-role-in-class");
  };
  static addMember = async (value: any) => {
    return axiosInstance.post("/learn/class/add-member", value);
  };

  static responseClassInvite = async (value: any) => {
    return axiosInstance.post("/learn/class/response-class-invite", value);
  };
  static getAllClassMember = async (params: any) => {
    return axiosInstance.get("learn/class/all-class-member", {
      params,
    });
  };
  static importMember = (data: any) => {
    return axiosInstance.post("learn/class/import-member", data);
  };
  
  static exportTasksGit = async (data: any) => {
    return axiosInstance.post("learn/class/export-tasks-git", data);
  };
  static getClassSettingUser = async (params: any) => {
    return axiosInstance.get("/learn/classsetting/search", {
      params,
    });
  };
  static getClassProgress = async (params: any) => {
    return axiosInstance.get("learn/class/get-class-progress", {
      params,
    });
  };
  static createClassSettingUser = async (value: any) => {
    return axiosInstance.post("/learn/classsetting/create", value);
  };
  static updateClassSettingUser = async (value: any) => {
    return axiosInstance.post("/learn/classsetting/update", value);
  };
  static deleteClassSetting = async (params: any) => {
    return axiosInstance.delete("/learn/classsetting/delete", {
      params,
    });
  };
}
